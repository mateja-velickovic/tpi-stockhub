import { CategoryService } from "../../../src/services/category.service";
import { Category, Product } from "../../../src/models";

jest.mock("../../../src/models");

describe("CategoryService", () => {
  let service: CategoryService;

  beforeEach(() => {
    service = new CategoryService();
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all categories with products sorted by name", async () => {
      const mockCategories = [{ id: 1, name: "Electronics", products: [] }];
      (Category.findAll as jest.Mock).mockResolvedValue(mockCategories);

      const result = await service.findAll();

      expect(Category.findAll).toHaveBeenCalledWith({
        include: [{ model: Product, as: "products" }],
        order: [["name", "ASC"]],
      });
      expect(result).toEqual(mockCategories);
    });
  });

  describe("findById", () => {
    it("should return category by id with products", async () => {
      const mockCategory = { id: 1, name: "Electronics", products: [] };
      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.findById(1);

      expect(Category.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: Product, as: "products" }],
      });
      expect(result).toEqual(mockCategory);
    });

    it("should throw if category not found", async () => {
      (Category.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow("Category not found");
    });
  });

  describe("create", () => {
    it("should create a new category", async () => {
      const data = { name: "New Category", description: "A description" };
      const mockCategory = { id: 1, ...data };
      (Category.findOne as jest.Mock).mockResolvedValue(null);
      (Category.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.create(data);

      expect(Category.findOne).toHaveBeenCalledWith({
        where: { name: data.name },
      });
      expect(result).toEqual(mockCategory);
    });

    it("should throw if category name already exists", async () => {
      (Category.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Electronics",
      });

      await expect(service.create({ name: "Electronics" })).rejects.toThrow(
        "Category name already exists",
      );
      expect(Category.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update and return the category", async () => {
      const mockCategory = {
        id: 1,
        name: "Electronics",
        update: jest.fn().mockResolvedValue({ id: 1, name: "Updated" }),
      };
      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.update(1, { name: "Updated" });

      expect(mockCategory.update).toHaveBeenCalledWith({ name: "Updated" });
      expect(result).toEqual({ id: 1, name: "Updated" });
    });

    it("should throw if category not found", async () => {
      (Category.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(service.update(999, { name: "X" })).rejects.toThrow(
        "Category not found",
      );
    });
  });

  describe("delete", () => {
    it("should delete category when no associated products", async () => {
      const mockCategory = {
        id: 1,
        name: "Empty",
        products: [],
        destroy: jest.fn(),
      };
      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);
      (Product.count as jest.Mock).mockResolvedValue(0);

      await service.delete(1);

      expect(Product.count).toHaveBeenCalledWith({ where: { categoryId: 1 } });
      expect(mockCategory.destroy).toHaveBeenCalled();
    });

    it("should throw if category has associated products", async () => {
      const mockCategory = { id: 1, name: "HasProducts", products: [] };
      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);
      (Product.count as jest.Mock).mockResolvedValue(3);

      await expect(service.delete(1)).rejects.toThrow(
        "Cannot delete category with associated products",
      );
    });

    it("should throw if category not found", async () => {
      (Category.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow("Category not found");
    });
  });
});
