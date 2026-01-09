import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

const connectDB = async () => {
  // Use in-memory MongoDB (works without external setup)
  try {
    console.log('⏳ Starting in-memory MongoDB...');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log('✅ In-memory MongoDB started');
    
    await mongoose.connect(uri);
    console.log('📦 MongoDB Connected');
    
    // Auto-seed
    await seedData();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

async function seedData() {
  const { default: bcrypt } = await import('bcryptjs');
  const { default: slugify } = await import('slugify');
  const { default: User } = await import('../models/User.js');
  const { default: Category } = await import('../models/Category.js');
  const { default: Product } = await import('../models/Product.js');
  
  const count = await Product.countDocuments();
  if (count > 0) return;
  
  console.log('🌱 Seeding data with real product images...');
  
  const cats = await Category.insertMany([
    { name: 'Laptops & Computers', description: 'Desktop computers, laptops, and accessories', icon: 'laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop' },
    { name: 'Smartphones & Tablets', description: 'Mobile phones and tablets', icon: 'smartphone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop' },
    { name: 'TV & Audio', description: 'Televisions, speakers, and audio equipment', icon: 'tv', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=600&fit=crop' },
    { name: 'Cameras & Photography', description: 'Digital cameras and accessories', icon: 'camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop' },
    { name: 'Gaming', description: 'Gaming consoles and accessories', icon: 'gamepad', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=600&fit=crop' },
    { name: 'Accessories', description: 'Cables, chargers, headphones', icon: 'headphones', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop' }
  ]);
  
  const makeSlug = (n, i) => slugify(n, { lower: true }) + '-' + i;
  
  await Product.insertMany([
    // LAPTOPS - Real laptop images
    { name: 'MacBook Pro 16"', slug: makeSlug('MacBook Pro', 1), shortDescription: 'M3 Pro, 18GB RAM, 512GB SSD', description: 'The most powerful MacBook Pro ever with M3 Pro chip.', price: 2499, comparePrice: 2699, category: cats[0]._id, brand: 'Apple', stock: 25, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', featured: true, tags: ['laptop', 'apple'], ratings: { average: 4.8, count: 156 } },
    { name: 'Dell XPS 15 OLED', slug: makeSlug('Dell XPS', 2), shortDescription: 'Intel i7, 16GB RAM, OLED', description: 'Stunning 15.6" 3.5K OLED display laptop.', price: 1899, comparePrice: 2199, category: cats[0]._id, brand: 'Dell', stock: 30, images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop', featured: true, tags: ['laptop', 'dell'], ratings: { average: 4.6, count: 89 } },
    { name: 'ASUS ROG Zephyrus G14', slug: makeSlug('ASUS ROG', 3), shortDescription: 'Ryzen 9, RTX 4060, RGB', description: 'Powerful gaming laptop with RGB keyboard.', price: 1599, comparePrice: 1799, category: cats[0]._id, brand: 'ASUS', stock: 15, images: ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop', featured: false, tags: ['laptop', 'gaming'], ratings: { average: 4.5, count: 67 } },
    
    // SMARTPHONES - Real phone images
    { name: 'iPhone 15 Pro Max', slug: makeSlug('iPhone 15', 4), shortDescription: 'A17 Pro, 256GB, Titanium', description: 'Titanium design with A17 Pro chip.', price: 1199, comparePrice: 1299, category: cats[1]._id, brand: 'Apple', stock: 50, images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', featured: true, tags: ['phone', 'apple'], ratings: { average: 4.9, count: 234 } },
    { name: 'Samsung Galaxy S24 Ultra', slug: makeSlug('Galaxy S24', 5), shortDescription: 'Snapdragon 8, S Pen', description: 'Galaxy AI with S Pen included.', price: 1299, comparePrice: 1399, category: cats[1]._id, brand: 'Samsung', stock: 40, images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop', featured: true, tags: ['phone', 'samsung'], ratings: { average: 4.7, count: 189 } },
    { name: 'Google Pixel 8 Pro', slug: makeSlug('Pixel 8', 6), shortDescription: 'Tensor G3, 128GB', description: 'Advanced AI camera with Tensor G3.', price: 999, comparePrice: 1099, category: cats[1]._id, brand: 'Google', stock: 25, images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop', featured: false, tags: ['phone', 'google'], ratings: { average: 4.5, count: 98 } },
    { name: 'Amazon Fire HD 10 Tablet', slug: makeSlug('Fire Tablet', 7), shortDescription: '10.1" HD, 32GB, Alexa', description: '10.1" Full HD tablet with Alexa.', price: 149.99, comparePrice: 179.99, category: cats[1]._id, brand: 'Amazon', stock: 60, images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', featured: false, tags: ['tablet', 'amazon'], ratings: { average: 4.3, count: 456 } },
    
    // TVs - Real TV images
    { name: 'Sony 65" BRAVIA XR OLED', slug: makeSlug('Sony TV', 8), shortDescription: 'QD-OLED, 4K, 120Hz', description: 'QD-OLED 4K 120Hz smart TV.', price: 2999, comparePrice: 3499, category: cats[2]._id, brand: 'Sony', stock: 15, images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop', featured: true, tags: ['tv', 'sony'], ratings: { average: 4.8, count: 78 } },
    { name: 'LG 55" C3 OLED evo', slug: makeSlug('LG OLED', 9), shortDescription: 'OLED evo, 4K, G-SYNC', description: 'OLED evo with G-SYNC for gaming.', price: 1499, comparePrice: 1799, category: cats[2]._id, brand: 'LG', stock: 20, images: ['https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&h=400&fit=crop', featured: false, tags: ['tv', 'lg'], ratings: { average: 4.6, count: 112 } },
    
    // CAMERAS - Real camera images
    { name: 'Sony Alpha a7 IV', slug: makeSlug('Sony Camera', 10), shortDescription: '33MP, 4K 60p', description: '33MP full-frame mirrorless camera.', price: 2499, comparePrice: 2699, category: cats[3]._id, brand: 'Sony', stock: 18, images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', featured: true, tags: ['camera', 'sony'], ratings: { average: 4.8, count: 56 } },
    { name: 'Canon EOS R6 Mark II', slug: makeSlug('Canon Camera', 11), shortDescription: '24.2MP, 40fps, 4K', description: '24.2MP hybrid camera with 40fps.', price: 2299, comparePrice: 2499, category: cats[3]._id, brand: 'Canon', stock: 12, images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop', featured: false, tags: ['camera', 'canon'], ratings: { average: 4.7, count: 43 } },
    
    // GAMING - Real gaming images
    { name: 'PlayStation 5', slug: makeSlug('PS5', 12), shortDescription: '825GB SSD, 4K 120fps', description: 'Next-gen gaming with 825GB SSD.', price: 499, comparePrice: 549, category: cats[4]._id, brand: 'Sony', stock: 35, images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', featured: true, tags: ['gaming', 'playstation'], ratings: { average: 4.9, count: 567 } },
    { name: 'Xbox Series X', slug: makeSlug('Xbox', 13), shortDescription: '12TF, 1TB SSD, 4K', description: '12TF gaming power with 1TB SSD.', price: 499, comparePrice: 549, category: cats[4]._id, brand: 'Microsoft', stock: 30, images: ['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop', featured: true, tags: ['gaming', 'xbox'], ratings: { average: 4.8, count: 423 } },
    { name: 'Nintendo Switch OLED', slug: makeSlug('Switch', 14), shortDescription: '7" OLED, 64GB', description: '7-inch OLED handheld gaming.', price: 349, comparePrice: 399, category: cats[4]._id, brand: 'Nintendo', stock: 25, images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop', featured: false, tags: ['gaming', 'nintendo'], ratings: { average: 4.7, count: 289 } },
    
    // ACCESSORIES - Real accessory images
    { name: 'Apple AirPods Pro 2', slug: makeSlug('AirPods', 15), shortDescription: 'ANC, Spatial Audio, USB-C', description: 'ANC earbuds with USB-C charging.', price: 249, comparePrice: 279, category: cats[5]._id, brand: 'Apple', stock: 100, images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop', featured: true, tags: ['earbuds', 'apple'], ratings: { average: 4.8, count: 678 } },
    { name: 'Sony WH-1000XM5', slug: makeSlug('Sony XM5', 16), shortDescription: 'ANC, 30hr Battery', description: 'Industry-leading ANC headphones.', price: 349, comparePrice: 399, category: cats[5]._id, brand: 'Sony', stock: 45, images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', featured: false, tags: ['headphones', 'sony'], ratings: { average: 4.7, count: 345 } },
    { name: 'Gaming Headset RGB', slug: makeSlug('Gaming Headset', 17), shortDescription: 'RGB, 7.1 Surround, Mic', description: 'RGB gaming headset with surround sound.', price: 79.99, comparePrice: 99.99, category: cats[5]._id, brand: 'Gaming Pro', stock: 75, images: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop', featured: false, tags: ['headset', 'gaming'], ratings: { average: 4.4, count: 234 } },
    { name: 'Logitech MX Master 3S', slug: makeSlug('MX Master', 18), shortDescription: '8K DPI, Quiet Clicks', description: 'Premium productivity mouse.', price: 99, comparePrice: 109, category: cats[5]._id, brand: 'Logitech', stock: 80, images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop'], thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', featured: false, tags: ['mouse', 'logitech'], ratings: { average: 4.6, count: 156 } },
  ]);
  
  await User.create({ name: 'Admin', email: 'admin@electro.com', password: await bcrypt.hash('admin123', 10), role: 'admin' });
  await User.create({ name: 'John', email: 'user@electro.com', password: await bcrypt.hash('user123', 10), role: 'user' });
  
  console.log('✅ Data seeded with real images! Admin: admin@electro.com / admin123');
}

export default connectDB;
