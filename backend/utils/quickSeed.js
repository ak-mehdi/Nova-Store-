import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Models - inline to avoid import issues
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  slug: String,
  description: String,
  image: String,
  icon: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

categorySchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  next();
});

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  shortDescription: String,
  price: Number,
  comparePrice: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: String,
  stock: Number,
  images: [String],
  thumbnail: String,
  specifications: [{ key: String, value: String }],
  featured: Boolean,
  tags: [String],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Real product images that match actual products
const categories = [
  { 
    name: 'Laptops & Computers', 
    description: 'Desktop computers, laptops, and accessories', 
    icon: 'laptop',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=600&fit=crop'
  },
  { 
    name: 'Cameras & Photography', 
    description: 'Digital cameras, lenses, and accessories', 
    icon: 'camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop'
  },
  { 
    name: 'Gaming', 
    description: 'Gaming consoles, games, and accessories', 
    icon: 'gamepad',
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=600&fit=crop'
  },
  { 
    name: 'Accessories', 
    description: 'Cables, chargers, and other accessories', 
    icon: 'headphones',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop'
  }
];

const getProducts = (categoryIds) => [
  // LAPTOPS
  {
    name: 'Apple MacBook Pro 16" M3 Pro',
    description: 'The most powerful MacBook Pro ever with M3 Pro chip.',
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
      { key: 'Storage', value: '512GB SSD' }
    ],
    featured: true,
    tags: ['laptop', 'apple', 'macbook'],
    ratings: { average: 4.8, count: 156 }
  },
  {
    name: 'Dell XPS 15 OLED',
    description: 'Stunning 15.6" 3.5K OLED display laptop.',
    shortDescription: 'Intel i7, 16GB RAM, 512GB SSD',
    price: 1899.00,
    comparePrice: 2199.00,
    category: categoryIds[0],
    brand: 'Dell',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Processor', value: 'Intel Core i7' },
      { key: 'Display', value: '15.6" OLED' }
    ],
    featured: true,
    tags: ['laptop', 'dell'],
    ratings: { average: 4.6, count: 89 }
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'Powerful 14-inch gaming laptop with RGB keyboard.',
    shortDescription: 'Ryzen 9, RTX 4060, 16GB RAM',
    price: 1599.00,
    comparePrice: 1799.00,
    category: categoryIds[0],
    brand: 'ASUS',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Processor', value: 'AMD Ryzen 9' },
      { key: 'Graphics', value: 'RTX 4060' }
    ],
    featured: false,
    tags: ['laptop', 'gaming', 'asus'],
    ratings: { average: 4.5, count: 67 }
  },
  // SMARTPHONES
  {
    name: 'iPhone 15 Pro Max',
    description: 'Titanium design with A17 Pro chip.',
    shortDescription: 'A17 Pro, 256GB, Titanium',
    price: 1199.00,
    comparePrice: 1299.00,
    category: categoryIds[1],
    brand: 'Apple',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Chip', value: 'A17 Pro' },
      { key: 'Storage', value: '256GB' }
    ],
    featured: true,
    tags: ['phone', 'apple', 'iphone'],
    ratings: { average: 4.9, count: 234 }
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI with S Pen included.',
    shortDescription: 'Snapdragon 8 Gen 3, 256GB',
    price: 1299.00,
    comparePrice: 1399.00,
    category: categoryIds[1],
    brand: 'Samsung',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { key: 'S Pen', value: 'Included' }
    ],
    featured: true,
    tags: ['phone', 'samsung', 'galaxy'],
    ratings: { average: 4.7, count: 189 }
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'Advanced AI camera and Tensor G3.',
    shortDescription: 'Tensor G3, 128GB',
    price: 999.00,
    comparePrice: 1099.00,
    category: categoryIds[1],
    brand: 'Google',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Processor', value: 'Google Tensor G3' }
    ],
    featured: false,
    tags: ['phone', 'google', 'pixel'],
    ratings: { average: 4.5, count: 98 }
  },
  {
    name: 'Amazon Fire HD 10 Tablet',
    description: '10.1" Full HD tablet with Alexa.',
    shortDescription: '10.1" HD, 32GB, Alexa',
    price: 149.99,
    comparePrice: 179.99,
    category: categoryIds[1],
    brand: 'Amazon',
    stock: 60,
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Display', value: '10.1" Full HD' }
    ],
    featured: false,
    tags: ['tablet', 'amazon'],
    ratings: { average: 4.3, count: 456 }
  },
  // TVs
  {
    name: 'Sony 65" BRAVIA XR OLED',
    description: 'QD-OLED 4K 120Hz smart TV.',
    shortDescription: 'QD-OLED, 4K, 120Hz',
    price: 2999.00,
    comparePrice: 3499.00,
    category: categoryIds[2],
    brand: 'Sony',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Display', value: '65" QD-OLED' }
    ],
    featured: true,
    tags: ['tv', 'sony', 'oled'],
    ratings: { average: 4.8, count: 78 }
  },
  {
    name: 'LG 55" C3 OLED evo',
    description: 'OLED evo with G-SYNC support.',
    shortDescription: 'OLED evo, 4K, G-SYNC',
    price: 1499.00,
    comparePrice: 1799.00,
    category: categoryIds[2],
    brand: 'LG',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Display', value: '55" OLED evo' }
    ],
    featured: false,
    tags: ['tv', 'lg', 'oled'],
    ratings: { average: 4.6, count: 112 }
  },
  // CAMERAS
  {
    name: 'Sony Alpha a7 IV',
    description: '33MP full-frame mirrorless camera.',
    shortDescription: '33MP, 4K 60p',
    price: 2499.00,
    comparePrice: 2699.00,
    category: categoryIds[3],
    brand: 'Sony',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Sensor', value: '33MP Full-Frame' }
    ],
    featured: true,
    tags: ['camera', 'sony'],
    ratings: { average: 4.8, count: 56 }
  },
  {
    name: 'Canon EOS R6 Mark II',
    description: '24.2MP hybrid camera.',
    shortDescription: '24.2MP, 40fps, 4K',
    price: 2299.00,
    comparePrice: 2499.00,
    category: categoryIds[3],
    brand: 'Canon',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Sensor', value: '24.2MP' }
    ],
    featured: false,
    tags: ['camera', 'canon'],
    ratings: { average: 4.7, count: 43 }
  },
  // GAMING
  {
    name: 'PlayStation 5',
    description: 'Next-gen gaming console with 825GB SSD.',
    shortDescription: '825GB SSD, 4K 120fps',
    price: 499.00,
    comparePrice: 549.00,
    category: categoryIds[4],
    brand: 'Sony',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Storage', value: '825GB SSD' }
    ],
    featured: true,
    tags: ['gaming', 'playstation', 'ps5'],
    ratings: { average: 4.9, count: 567 }
  },
  {
    name: 'Xbox Series X',
    description: '12TF gaming console with 1TB SSD.',
    shortDescription: '12TF, 1TB SSD, 4K',
    price: 499.00,
    comparePrice: 549.00,
    category: categoryIds[4],
    brand: 'Microsoft',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop',
    specifications: [
      { key: 'GPU', value: '12 TFLOPs' }
    ],
    featured: true,
    tags: ['gaming', 'xbox'],
    ratings: { average: 4.8, count: 423 }
  },
  {
    name: 'Nintendo Switch OLED',
    description: '7-inch OLED handheld gaming.',
    shortDescription: '7" OLED, 64GB',
    price: 349.00,
    comparePrice: 399.00,
    category: categoryIds[4],
    brand: 'Nintendo',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Display', value: '7" OLED' }
    ],
    featured: false,
    tags: ['gaming', 'nintendo', 'switch'],
    ratings: { average: 4.7, count: 289 }
  },
  // ACCESSORIES
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'ANC earbuds with USB-C charging case.',
    shortDescription: 'ANC, Spatial Audio, USB-C',
    price: 249.00,
    comparePrice: 279.00,
    category: categoryIds[5],
    brand: 'Apple',
    stock: 100,
    images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop',
    specifications: [
      { key: 'ANC', value: 'Yes' }
    ],
    featured: true,
    tags: ['earbuds', 'apple', 'airpods'],
    ratings: { average: 4.8, count: 678 }
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading ANC headphones.',
    shortDescription: 'ANC, 30hr Battery',
    price: 349.00,
    comparePrice: 399.00,
    category: categoryIds[5],
    brand: 'Sony',
    stock: 45,
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Battery', value: '30 hours' }
    ],
    featured: false,
    tags: ['headphones', 'sony'],
    ratings: { average: 4.7, count: 345 }
  },
  {
    name: 'Gaming Headset RGB',
    description: 'LED gaming headset with microphone.',
    shortDescription: 'RGB, 7.1 Surround, Mic',
    price: 79.99,
    comparePrice: 99.99,
    category: categoryIds[5],
    brand: 'Gaming',
    stock: 75,
    images: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop',
    specifications: [
      { key: 'Audio', value: '7.1 Surround' }
    ],
    featured: false,
    tags: ['headset', 'gaming', 'rgb'],
    ratings: { average: 4.4, count: 234 }
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Productivity mouse with 8K DPI.',
    shortDescription: '8K DPI, Quiet Clicks',
    price: 99.00,
    comparePrice: 109.00,
    category: categoryIds[5],
    brand: 'Logitech',
    stock: 80,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop'],
    thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    specifications: [
      { key: 'DPI', value: '8000' }
    ],
    featured: false,
    tags: ['mouse', 'logitech'],
    ratings: { average: 4.6, count: 156 }
  }
];

const runSeed = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/electro-store';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected');

    // Clear data
    console.log('Clearing old data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Data cleared');

    // Create users
    console.log('Creating users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@electro.com',
      password: adminPassword,
      role: 'admin'
    });
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'John Doe',
      email: 'user@electro.com',
      password: userPassword,
      role: 'user'
    });
    console.log('✅ Users created');

    // Create categories
    console.log('Creating categories with images...');
    const createdCategories = [];
    for (const cat of categories) {
      const created = await Category.create(cat);
      createdCategories.push(created);
    }
    const categoryIds = createdCategories.map(c => c._id);
    console.log('✅ Categories created');

    // Create products
    console.log('Creating products with images...');
    const products = getProducts(categoryIds);
    for (const prod of products) {
      await Product.create(prod);
    }
    console.log('✅ Products created');

    console.log('');
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - ${createdCategories.length} categories`);
    console.log(`   - ${products.length} products`);
    console.log(`   - 2 users`);
    console.log('');
    console.log('🔐 Login credentials:');
    console.log('   Admin: admin@electro.com / admin123');
    console.log('   User: user@electro.com / user123');
    console.log('');
    console.log('🔄 Restart your backend server and refresh the browser!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

runSeed();
