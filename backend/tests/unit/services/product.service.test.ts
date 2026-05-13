import { ProductService } from "../../../src/services/product.service";
import { Product, Category } from "../../../src/models";

jest.mock("../../../src/models");

describe("ProductService", () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all products with categories", async () => {
      const mockProducts = [
        { id: 1, name: "Laptop", category: { id: 1, name: "Électronique" } },
      ];
      (Product.findAll as jest.Mock).mockResolvedValue(mockProducts);

      const result = await service.findAll();

      expect(Product.findAll).toHaveBeenCalledWith({
        include: [{ model: Category, as: "category" }],
        order: [["createdAt", "DESC"]],
      });
      expect(result).toEqual(mockProducts);
    });
  });

  describe("findById", () => {
    it("should return a product by id", async () => {
      const mockProduct = { id: 1, name: "Laptop" };
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.findById(1);

      expect(result).toEqual(mockProduct);
    });

    it("should throw if product not found", async () => {
      (Product.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow("Product not found");
    });
  });

  describe("create", () => {
    it("should create a product", async () => {
      const productData = {
        name: "New Item",
        sku: "NEW-001",
        price: 99.99,
        categoryId: 1,
      };
      const mockCategory = { id: 1, name: "Test" };
      const mockProduct = { id: 1, ...productData };

      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);
      (Product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.create(productData);

      expect(result).toEqual(mockProduct);
    });

    it("should throw if category not found", async () => {
      (Category.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create({
          name: "X",
          sku: "X-001",
          price: 9.99,
          categoryId: 999,
        }),
      ).rejects.toThrow("Category not found");
      expect(Product.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update and return product", async () => {
      const updated = { id: 1, name: "Updated Laptop" };
      const mockProduct = {
        id: 1,
        name: "Laptop",
        update: jest.fn().mockResolvedValue(updated),
      };
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.update(1, { name: "Updated Laptop" });

      expect(mockProduct.update).toHaveBeenCalledWith({
        name: "Updated Laptop",
      });
      expect(result).toEqual(updated);
    });

    it("should throw if product not found", async () => {
      (Product.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(service.update(999, { name: "X" })).rejects.toThrow(
        "Product not found",
      );
    });
  });

  describe("delete", () => {
    it("should delete a product by id", async () => {
      const mockProduct = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      await service.delete(1);

      expect(mockProduct.destroy).toHaveBeenCalled();
    });

    it("should throw if product not found", async () => {
      (Product.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow("Product not found");
    });
  });

  describe("findLowStock", () => {
    it("should return products where quantity <= minQuantity", async () => {
      const mockProducts = [
        { id: 1, quantity: 5, minQuantity: 10 },
        { id: 2, quantity: 20, minQuantity: 10 },
        { id: 3, quantity: 5, minQuantity: 5 },
      ];
      (Product.findAll as jest.Mock).mockResolvedValue(mockProducts);

      const result = await service.findLowStock();

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(mockProducts[0]);
      expect(result).toContainEqual(mockProducts[2]);
      expect(result).not.toContainEqual(mockProducts[1]);
    });

    it("should return empty array when no products are low stock", async () => {
      const mockProducts = [
        { id: 1, quantity: 20, minQuantity: 5 },
        { id: 2, quantity: 100, minQuantity: 10 },
      ];
      (Product.findAll as jest.Mock).mockResolvedValue(mockProducts);

      const result = await service.findLowStock();

      expect(result).toHaveLength(0);
    });
  });
});
