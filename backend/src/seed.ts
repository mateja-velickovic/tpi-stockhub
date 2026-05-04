import bcrypt from 'bcryptjs';
import sequelize from './config/database';
import { User, Category, Product, StockMovement } from './models';

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    console.log('Seeding database...');

    // Users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const managerPassword = await bcrypt.hash('manager123', 10);

    const admin = await User.create({
      username: 'admin',
      email: 'admin@stockhub.ch',
      password: adminPassword,
      role: 'admin',
    });

    const manager = await User.create({
      username: 'mvelickovic',
      email: 'mateja@stockhub.ch',
      password: managerPassword,
      role: 'manager',
    });

    // Categories
    const electronics = await Category.create({
      name: 'Électronique',
      description: 'Composants et appareils électroniques',
    });
    const furniture = await Category.create({
      name: 'Mobilier',
      description: 'Meubles et équipements de bureau',
    });
    const supplies = await Category.create({
      name: 'Fournitures',
      description: 'Fournitures de bureau courantes',
    });
    const tools = await Category.create({
      name: 'Outillage',
      description: 'Outils et équipements techniques',
    });

    // Products
    const laptop = await Product.create({
      name: 'Laptop Dell Latitude 5540',
      sku: 'ELEC-001',
      description: 'Ordinateur portable professionnel 15 pouces',
      price: 1299.0,
      quantity: 12,
      minQuantity: 5,
      categoryId: electronics.id,
    });
    const monitor = await Product.create({
      name: 'Écran Dell U2723QE 27"',
      sku: 'ELEC-002',
      description: 'Moniteur 4K USB-C',
      price: 589.0,
      quantity: 8,
      minQuantity: 3,
      categoryId: electronics.id,
    });
    const keyboard = await Product.create({
      name: 'Clavier Logitech MX Keys',
      sku: 'ELEC-003',
      description: 'Clavier sans fil professionnel',
      price: 109.0,
      quantity: 25,
      minQuantity: 10,
      categoryId: electronics.id,
    });
    await Product.create({
      name: 'Bureau assis-debout FlexiSpot',
      sku: 'MOB-001',
      description: 'Bureau réglable en hauteur électrique',
      price: 459.0,
      quantity: 3,
      minQuantity: 5,
      categoryId: furniture.id,
    });
    await Product.create({
      name: 'Chaise ergonomique Steelcase',
      sku: 'MOB-002',
      description: 'Chaise de bureau haut de gamme',
      price: 890.0,
      quantity: 6,
      minQuantity: 3,
      categoryId: furniture.id,
    });
    const paper = await Product.create({
      name: 'Papier A4 Navigator 80g',
      sku: 'FOUR-001',
      description: 'Ramette 500 feuilles',
      price: 5.9,
      quantity: 150,
      minQuantity: 50,
      categoryId: supplies.id,
    });
    await Product.create({
      name: 'Stylos Pilot FriXion (lot 12)',
      sku: 'FOUR-002',
      description: 'Stylos effaçables assortis',
      price: 18.5,
      quantity: 2,
      minQuantity: 10,
      categoryId: supplies.id,
    });
    await Product.create({
      name: 'Perceuse Bosch Professional',
      sku: 'OUT-001',
      description: 'Perceuse-visseuse sans fil 18V',
      price: 189.0,
      quantity: 4,
      minQuantity: 2,
      categoryId: tools.id,
    });

    // Stock movements
    await StockMovement.create({ type: 'IN', quantity: 20, reason: 'Commande initiale', productId: laptop.id, userId: admin.id });
    await StockMovement.create({ type: 'OUT', quantity: 8, reason: 'Distribution équipe dev', productId: laptop.id, userId: manager.id });
    await StockMovement.create({ type: 'IN', quantity: 10, reason: 'Commande fournisseur', productId: monitor.id, userId: admin.id });
    await StockMovement.create({ type: 'OUT', quantity: 2, reason: 'Nouveaux postes de travail', productId: monitor.id, userId: manager.id });
    await StockMovement.create({ type: 'IN', quantity: 30, reason: 'Réapprovisionnement', productId: keyboard.id, userId: admin.id });
    await StockMovement.create({ type: 'OUT', quantity: 5, reason: 'Remplacement claviers défectueux', productId: keyboard.id, userId: manager.id });
    await StockMovement.create({ type: 'IN', quantity: 200, reason: 'Commande annuelle', productId: paper.id, userId: admin.id });
    await StockMovement.create({ type: 'OUT', quantity: 50, reason: 'Consommation mensuelle', productId: paper.id, userId: manager.id });

    console.log('Database seeded successfully!');
    console.log('Users: admin@stockhub.ch / admin123, mateja@stockhub.ch / manager123');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
