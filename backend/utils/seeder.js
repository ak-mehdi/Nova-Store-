import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Sample data with consistent professional images
const categories = [
  { 
    name: 'Laptops & Computers', 
    description: 'Desktop computers, laptops, and accessories', 
    icon: 'laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop'
  },
  { 
    name: 'Smartphones & Tablets', 
    description: 'Mobile phones and tablets', 
    icon: 'smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop'
  },
  { 
    name: 'TV & Audio', 
    description: 'Televisions, speakers, and audio equipment', 
    icon: 'tv',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop'
  },
  { 
    name: 'Cameras & Photography', 
    description: 'Digital cameras, lenses, and accessories', 
    icon: 'camera',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop'
  },
  { 
    name: 'Gaming', 
    description: 'Gaming consoles, games, and accessories', 
    icon: 'gamepad',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop'
  },
  { 
    name: 'Accessories', 
    description: 'Cables, chargers, and other accessories', 
    icon: 'headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop'
  }
];

const getProducts = (categoryIds) => [
  {
    name: 'Apple MacBook Pro 16" M3 Pro',
    description: 'The most powerful MacBook Pro ever. With the blazing-fast M3 Pro chip, up to 22 hours of battery life, a stunning Liquid Retina XDR display, and all the ports you need.',
    shortDescription: 'M3 Pro chip, 18GB RAM, 512GB SSD',
    price: 2499.00,
    comparePrice: 2699.00,
    category: categoryIds[0],
    brand: 'Apple',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Processor', value: 'Apple M3 Pro' },
      { key: 'RAM', value: '18GB' },
      { key: 'Storage', value: '512GB SSD' },
      { key: 'Display', value: '16.2" Liquid Retina XDR' },
      { key: 'Battery', value: 'Up to 22 hours' }
    ],
    featured: true,
    tags: ['laptop', 'apple', 'macbook', 'pro']
  },
  {
    name: 'Dell XPS 15 OLED',
    description: 'Experience stunning visuals on the 15.6" 3.5K OLED display. Powered by 13th Gen Intel Core processors and NVIDIA graphics.',
    shortDescription: 'Intel i7, 16GB RAM, 512GB SSD, OLED Display',
    price: 1899.00,
    comparePrice: 2199.00,
    category: categoryIds[0],
    brand: 'Dell',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Processor', value: 'Intel Core i7-13700H' },
      { key: 'RAM', value: '16GB DDR5' },
      { key: 'Storage', value: '512GB SSD' },
      { key: 'Display', value: '15.6" 3.5K OLED' },
      { key: 'Graphics', value: 'NVIDIA RTX 4050' }
    ],
    featured: true,
    tags: ['laptop', 'dell', 'xps', 'oled']
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'The most powerful 14-inch gaming laptop. High-performance gaming on a light, portable chassis.',
    shortDescription: 'Ryzen 9, RTX 4060, 16GB RAM, 1TB SSD',
    price: 1599.00,
    comparePrice: 1799.00,
    category: categoryIds[0],
    brand: 'ASUS',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Processor', value: 'AMD Ryzen 9 7940HS' },
      { key: 'RAM', value: '16GB DDR5' },
      { key: 'Storage', value: '1TB SSD' },
      { key: 'Graphics', value: 'NVIDIA RTX 4060' }
    ],
    featured: false,
    tags: ['laptop', 'gaming', 'asus', 'rog']
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'Titanium. A17 Pro chip. A customizable Action button. The most powerful iPhone ever.',
    shortDescription: 'A17 Pro, 256GB, Titanium Design',
    price: 1199.00,
    comparePrice: 1299.00,
    category: categoryIds[1],
    brand: 'Apple',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1592286927505-038fb6d9e0f7?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1592286927505-038fb6d9e0f7?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Chip', value: 'A17 Pro' },
      { key: 'Storage', value: '256GB' },
      { key: 'Display', value: '6.7" Super Retina XDR' },
      { key: 'Camera', value: '48MP Main + 12MP Ultra Wide' },
      { key: 'Material', value: 'Titanium' }
    ],
    featured: true,
    tags: ['phone', 'apple', 'iphone', 'pro']
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Meet Galaxy AI. The ultimate Galaxy experience with built-in AI features, S Pen, and pro-grade camera.',
    shortDescription: 'Snapdragon 8 Gen 3, 256GB, S Pen included',
    price: 1299.00,
    comparePrice: 1399.00,
    category: categoryIds[1],
    brand: 'Samsung',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { key: 'Storage', value: '256GB' },
      { key: 'Display', value: '6.8" Dynamic AMOLED 2X' },
      { key: 'Camera', value: '200MP Main' },
      { key: 'S Pen', value: 'Included' }
    ],
    featured: true,
    tags: ['phone', 'samsung', 'galaxy', 'android']
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'The all-pro phone engineered by Google. Sleek, sophisticated, and has the most advanced Pixel Camera yet.',
    shortDescription: 'Google Tensor G3, 128GB, AI Features',
    price: 999.00,
    comparePrice: 1099.00,
    category: categoryIds[1],
    brand: 'Google',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Processor', value: 'Google Tensor G3' },
      { key: 'Storage', value: '128GB' },
      { key: 'Display', value: '6.7" Super Actua Display' }
    ],
    featured: false,
    tags: ['phone', 'google', 'pixel', 'android']
  },
  {
    name: 'Sony 65" BRAVIA XR A95L OLED',
    description: 'Experience perfect blacks and incredible brightness with the Cognitive Processor XR and QD-OLED technology.',
    shortDescription: 'QD-OLED, 4K, 120Hz, Google TV',
    price: 2999.00,
    comparePrice: 3499.00,
    category: categoryIds[2],
    brand: 'Sony',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Display', value: '65" QD-OLED' },
      { key: 'Resolution', value: '4K (3840 x 2160)' },
      { key: 'Refresh Rate', value: '120Hz' },
      { key: 'Processor', value: 'Cognitive Processor XR' },
      { key: 'Smart TV', value: 'Google TV' }
    ],
    featured: true,
    tags: ['tv', 'sony', 'oled', '4k']
  },
  {
    name: 'LG 55" C3 OLED evo',
    description: 'Self-lit OLED pixels bring infinite contrast and perfect blacks. Ideal for gaming with 4K @ 120Hz.',
    shortDescription: 'OLED evo, 4K, G-SYNC Compatible',
    price: 1499.00,
    comparePrice: 1799.00,
    category: categoryIds[2],
    brand: 'LG',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Display', value: '55" OLED evo' },
      { key: 'Resolution', value: '4K (3840 x 2160)' },
      { key: 'Refresh Rate', value: '120Hz' },
      { key: 'Gaming', value: 'G-SYNC, FreeSync' },
      { key: 'Smart TV', value: 'webOS' }
    ],
    featured: false,
    tags: ['tv', 'lg', 'oled', 'gaming']
  },
  {
    name: 'Sony Alpha a7 IV',
    description: 'The perfect all-rounder. 33MP full-frame sensor, real-time Eye AF, and 4K 60p video recording.',
    shortDescription: '33MP Full-Frame, 4K 60p, Real-time AF',
    price: 2499.00,
    comparePrice: 2699.00,
    category: categoryIds[3],
    brand: 'Sony',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Sensor', value: '33MP Full-Frame CMOS' },
      { key: 'Video', value: '4K 60p 10-bit' },
      { key: 'AF Points', value: '759 phase detection' },
      { key: 'ISO Range', value: '100-51200' },
      { key: 'Stabilization', value: '5.5-stop IBIS' }
    ],
    featured: true,
    tags: ['camera', 'sony', 'mirrorless', 'fullframe']
  },
  {
    name: 'Canon EOS R6 Mark II',
    description: 'The ultimate hybrid camera. High-speed shooting, stunning 4K video, and advanced autofocus.',
    shortDescription: '24.2MP, 40fps shooting, 4K 60p',
    price: 2299.00,
    comparePrice: 2499.00,
    category: categoryIds[3],
    brand: 'Canon',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1606980286173-0ab4ac7c5f58?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1606980286173-0ab4ac7c5f58?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Sensor', value: '24.2MP Full-Frame' },
      { key: 'Autofocus', value: 'Dual Pixel CMOS AF II' }
    ],
    featured: false,
    tags: ['camera', 'canon', 'mirrorless']
  },
  {
    name: 'PlayStation 5',
    description: 'Experience lightning-fast loading, haptic feedback, adaptive triggers, and 3D audio on PS5.',
    shortDescription: 'Ultra HD Blu-ray, 825GB SSD',
    price: 499.00,
    comparePrice: 549.00,
    category: categoryIds[4],
    brand: 'Sony',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
    specifications: [
      { key: 'CPU', value: 'AMD Zen 2, 8 cores @ 3.5GHz' },
      { key: 'GPU', value: '10.28 TFLOPs RDNA 2' },
      { key: 'Storage', value: '825GB SSD' },
      { key: 'Resolution', value: 'Up to 8K' },
      { key: 'Frame Rate', value: 'Up to 120fps' }
    ],
    featured: true,
    tags: ['gaming', 'console', 'playstation', 'ps5']
  },
  {
    name: 'Xbox Series X',
    description: 'The fastest, most powerful Xbox ever. 12 teraflops of processing power and true 4K gaming.',
    shortDescription: '12TF GPU, 1TB SSD, 4K @ 120fps',
    price: 499.00,
    comparePrice: 549.00,
    category: categoryIds[4],
    brand: 'Microsoft',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=400&h=400&fit=crop',
    specifications: [
      { key: 'CPU', value: 'AMD Zen 2, 8 cores @ 3.8GHz' },
      { key: 'GPU', value: '12 TFLOPs RDNA 2' },
      { key: 'Storage', value: '1TB NVMe SSD' },
      { key: 'Resolution', value: 'Up to 8K' },
      { key: 'Frame Rate', value: 'Up to 120fps' }
    ],
    featured: true,
    tags: ['gaming', 'console', 'xbox', 'microsoft']
  },
  {
    name: 'Nintendo Switch OLED',
    description: 'Play at home on the TV or on-the-go with a vibrant 7-inch OLED screen.',
    shortDescription: 'OLED Display, 64GB Storage',
    price: 349.00,
    comparePrice: 399.00,
    category: categoryIds[4],
    brand: 'Nintendo',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Display', value: '7" OLED' },
      { key: 'Modes', value: 'TV, Tabletop, Handheld' },
      { key: 'Storage', value: '64GB (expandable)' },
      { key: 'Battery', value: '4.5-9 hours' }
    ],
    featured: false,
    tags: ['gaming', 'console', 'nintendo', 'switch']
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'Rebuilt from the sound up. Now with 2x more Active Noise Cancellation and Adaptive Transparency.',
    shortDescription: 'ANC, Spatial Audio, USB-C',
    price: 249.00,
    comparePrice: 279.00,
    category: categoryIds[5],
    brand: 'Apple',
    stock: 100,
    images: ['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Driver', value: 'Apple H2 chip' },
      { key: 'ANC', value: '2x more active noise cancellation' },
      { key: 'Battery', value: '6 hours (30 hours with case)' },
      { key: 'Charging', value: 'USB-C, MagSafe, Qi' },
      { key: 'Water Resistance', value: 'IPX4' }
    ],
    featured: true,
    tags: ['earbuds', 'apple', 'airpods', 'wireless']
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation with two processors controlling 8 microphones.',
    shortDescription: 'ANC, 30hr Battery, Multipoint',
    price: 349.00,
    comparePrice: 399.00,
    category: categoryIds[5],
    brand: 'Sony',
    stock: 45,
    images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Driver', value: '30mm' },
      { key: 'ANC', value: 'Dual Processor' },
      { key: 'Battery', value: '30 hours' },
      { key: 'Charging', value: 'USB-C (3 min = 3 hours)' },
      { key: 'Multipoint', value: 'Yes (2 devices)' }
    ],
    featured: false,
    tags: ['headphones', 'sony', 'wireless', 'anc']
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'The iconic productivity mouse is now quieter and more precise with an 8K DPI sensor.',
    shortDescription: '8K DPI, Quiet Clicks, USB-C',
    price: 99.00,
    comparePrice: 109.00,
    category: categoryIds[5],
    brand: 'Logitech',
    stock: 80,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Sensor', value: '8000 DPI' },
      { key: 'Battery', value: '70 days' },
      { key: 'Connection', value: 'Bluetooth, USB Receiver' },
      { key: 'Buttons', value: '7 programmable' },
      { key: 'Scroll', value: 'MagSpeed electromagnetic' }
    ],
    featured: false,
    tags: ['mouse', 'logitech', 'wireless', 'productivity']
  },
  {
    name: 'Amazon Fire HD 10 Tablet',
    description: 'Our best 10.1" tablet for watching videos, reading, and light gaming. Full HD screen with hands-free Alexa.',
    shortDescription: '10.1" Full HD, 32GB, Alexa Built-in',
    price: 149.99,
    comparePrice: 179.99,
    category: categoryIds[1],
    brand: 'Amazon',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1585790050230-5dd28404f64e?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1585790050230-5dd28404f64e?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Display', value: '10.1" 1920x1200 Full HD' },
      { key: 'Storage', value: '32GB (expandable)' },
      { key: 'Battery', value: 'Up to 12 hours' },
      { key: 'Features', value: 'Alexa, USB-C' },
      { key: 'Weight', value: '465g' }
    ],
    featured: false,
    tags: ['tablet', 'amazon', 'fire', 'entertainment']
  }
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('Data cleared...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@electro.com',
      password: adminPassword,
      role: 'admin'
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'John Doe',
      email: 'user@electro.com',
      password: userPassword,
      role: 'user'
    });

    console.log('Users created...');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    const categoryIds = createdCategories.map(cat => cat._id);

    console.log('Categories created...');

    // Create products
    const productsData = getProducts(categoryIds);
    await Product.insertMany(productsData);

    console.log('Products created...');

    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('Admin credentials:');
    console.log('  Email: admin@electro.com');
    console.log('  Password: admin123');
    console.log('');
    console.log('User credentials:');
    console.log('  Email: user@electro.com');
    console.log('  Password: user123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();

