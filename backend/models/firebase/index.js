import admin from 'firebase-admin';
import slugify from 'slugify';
import bcrypt from 'bcryptjs';

let db;

// Initialize Firestore
export const initFirestore = async () => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'electro-ecommerce-demo'
    });
  }
  db = admin.firestore();
  
  // Seed initial data if empty
  await seedIfEmpty();
  
  return db;
};

export const getFirestore = () => db;

// Helper to convert Firestore doc to object with _id
const docToObj = (doc) => {
  if (!doc.exists) return null;
  return { _id: doc.id, ...doc.data() };
};

// ============ USER MODEL ============
export const User = {
  collection: () => db.collection('users'),
  
  async findById(id) {
    const doc = await this.collection().doc(id).get();
    return docToObj(doc);
  },
  
  async findOne(query) {
    let q = this.collection();
    for (const [key, value] of Object.entries(query)) {
      q = q.where(key, '==', value);
    }
    const snapshot = await q.limit(1).get();
    if (snapshot.empty) return null;
    return docToObj(snapshot.docs[0]);
  },
  
  async create(data) {
    const docRef = await this.collection().add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return docToObj(doc);
  },
  
  async findByIdAndUpdate(id, data, options = {}) {
    await this.collection().doc(id).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    if (options.new) {
      return this.findById(id);
    }
  },
  
  async countDocuments() {
    const snapshot = await this.collection().count().get();
    return snapshot.data().count;
  }
};

// ============ CATEGORY MODEL ============
export const Category = {
  collection: () => db.collection('categories'),
  
  async find() {
    const snapshot = await this.collection().get();
    return snapshot.docs.map(docToObj);
  },
  
  async findById(id) {
    const doc = await this.collection().doc(id).get();
    return docToObj(doc);
  },
  
  async findOne(query) {
    let q = this.collection();
    for (const [key, value] of Object.entries(query)) {
      q = q.where(key, '==', value);
    }
    const snapshot = await q.limit(1).get();
    if (snapshot.empty) return null;
    return docToObj(snapshot.docs[0]);
  },
  
  async create(data) {
    const slug = slugify(data.name, { lower: true });
    const docRef = await this.collection().add({
      ...data,
      slug,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return docToObj(doc);
  },
  
  async insertMany(items) {
    const batch = db.batch();
    const results = [];
    for (const item of items) {
      const slug = slugify(item.name, { lower: true });
      const docRef = this.collection().doc();
      batch.set(docRef, { ...item, slug, createdAt: new Date() });
      results.push({ _id: docRef.id, ...item, slug });
    }
    await batch.commit();
    return results;
  },
  
  async countDocuments() {
    const snapshot = await this.collection().count().get();
    return snapshot.data().count;
  },
  
  async deleteMany() {
    const snapshot = await this.collection().get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }
};

// ============ PRODUCT MODEL ============
export const Product = {
  collection: () => db.collection('products'),
  
  async find(query = {}) {
    let q = this.collection();
    
    if (query.category) {
      q = q.where('category', '==', query.category);
    }
    if (query.featured) {
      q = q.where('featured', '==', true);
    }
    if (query.isActive !== undefined) {
      q = q.where('isActive', '==', query.isActive);
    }
    
    const snapshot = await q.get();
    let results = snapshot.docs.map(docToObj);
    
    // Populate category
    for (let product of results) {
      if (product.category) {
        product.category = await Category.findById(product.category);
      }
    }
    
    return results;
  },
  
  async findById(id) {
    const doc = await this.collection().doc(id).get();
    const product = docToObj(doc);
    if (product && product.category) {
      product.category = await Category.findById(product.category);
    }
    return product;
  },
  
  async findOne(query) {
    let q = this.collection();
    for (const [key, value] of Object.entries(query)) {
      q = q.where(key, '==', value);
    }
    const snapshot = await q.limit(1).get();
    if (snapshot.empty) return null;
    const product = docToObj(snapshot.docs[0]);
    if (product && product.category) {
      product.category = await Category.findById(product.category);
    }
    return product;
  },
  
  async create(data) {
    const slug = slugify(data.name, { lower: true }) + '-' + Date.now().toString(36);
    const docRef = await this.collection().add({
      ...data,
      slug,
      ratings: { average: 0, count: 0 },
      soldCount: 0,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return this.findById(docRef.id);
  },
  
  async insertMany(items) {
    const batch = db.batch();
    const results = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const slug = slugify(item.name, { lower: true }) + '-' + (i + 1);
      const docRef = this.collection().doc();
      const product = {
        ...item,
        slug,
        ratings: { average: 0, count: 0 },
        soldCount: 0,
        isActive: true,
        createdAt: new Date()
      };
      batch.set(docRef, product);
      results.push({ _id: docRef.id, ...product });
    }
    await batch.commit();
    return results;
  },
  
  async findByIdAndUpdate(id, data, options = {}) {
    await this.collection().doc(id).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    if (options.new) {
      return this.findById(id);
    }
  },
  
  async findByIdAndDelete(id) {
    const product = await this.findById(id);
    await this.collection().doc(id).delete();
    return product;
  },
  
  async countDocuments(query = {}) {
    let q = this.collection();
    if (query.isActive !== undefined) {
      q = q.where('isActive', '==', query.isActive);
    }
    const snapshot = await q.count().get();
    return snapshot.data().count;
  },
  
  async deleteMany() {
    const snapshot = await this.collection().get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }
};

// ============ CART MODEL ============
export const Cart = {
  collection: () => db.collection('carts'),
  
  async findOne(query) {
    let q = this.collection();
    for (const [key, value] of Object.entries(query)) {
      q = q.where(key, '==', value);
    }
    const snapshot = await q.limit(1).get();
    if (snapshot.empty) return null;
    const cart = docToObj(snapshot.docs[0]);
    
    // Populate products in items
    if (cart.items) {
      for (let item of cart.items) {
        if (item.product) {
          item.product = await Product.findById(item.product);
        }
      }
    }
    return cart;
  },
  
  async create(data) {
    const docRef = await this.collection().add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return this.findOne({ user: data.user });
  },
  
  async findOneAndUpdate(query, data, options = {}) {
    const existing = await this.findOne(query);
    if (existing) {
      await this.collection().doc(existing._id).update(data);
      if (options.new) {
        return this.findOne(query);
      }
    } else if (options.upsert) {
      return this.create({ ...query, ...data });
    }
    return existing;
  }
};

// ============ ORDER MODEL ============
export const Order = {
  collection: () => db.collection('orders'),
  
  async find(query = {}) {
    let q = this.collection();
    if (query.user) {
      q = q.where('user', '==', query.user);
    }
    q = q.orderBy('createdAt', 'desc');
    const snapshot = await q.get();
    return snapshot.docs.map(docToObj);
  },
  
  async findById(id) {
    const doc = await this.collection().doc(id).get();
    return docToObj(doc);
  },
  
  async create(data) {
    const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase();
    const docRef = await this.collection().add({
      ...data,
      orderNumber,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return this.findById(docRef.id);
  },
  
  async findByIdAndUpdate(id, data, options = {}) {
    await this.collection().doc(id).update(data);
    if (options.new) {
      return this.findById(id);
    }
  },
  
  async countDocuments(query = {}) {
    let q = this.collection();
    if (query.status) {
      q = q.where('status', '==', query.status);
    }
    const snapshot = await q.count().get();
    return snapshot.data().count;
  },

  async aggregate(pipeline) {
    // Simple aggregation for revenue
    const snapshot = await this.collection().get();
    let total = 0;
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.totalAmount) total += data.totalAmount;
    });
    return [{ _id: null, total }];
  }
};

// ============ SEED DATA ============
async function seedIfEmpty() {
  const productCount = await Product.countDocuments();
  if (productCount > 0) {
    console.log('📦 Firebase already has data');
    return;
  }
  
  console.log('🌱 Seeding Firebase with sample data...');
  
  // Create categories
  const categories = await Category.insertMany([
    { name: 'Laptops & Computers', description: 'Laptops and computers', icon: 'laptop' },
    { name: 'Smartphones & Tablets', description: 'Mobile phones', icon: 'smartphone' },
    { name: 'TV & Audio', description: 'TVs and audio', icon: 'tv' },
    { name: 'Cameras & Photography', description: 'Cameras', icon: 'camera' },
    { name: 'Gaming', description: 'Gaming consoles', icon: 'gamepad' },
    { name: 'Accessories', description: 'Accessories', icon: 'headphones' }
  ]);
  
  // Create products
  await Product.insertMany([
    { name: 'MacBook Pro 16"', shortDescription: 'M3 Pro, 18GB RAM', description: 'Powerful laptop', price: 2499, comparePrice: 2699, category: categories[0]._id, brand: 'Apple', stock: 25, images: ['https://placehold.co/800x800/232F3E/FEBD69?text=MacBook'], thumbnail: 'https://placehold.co/400x400/232F3E/FEBD69?text=MacBook', featured: true, tags: ['laptop'] },
    { name: 'Dell XPS 15', shortDescription: 'i7, 16GB RAM', description: 'OLED display', price: 1899, comparePrice: 2199, category: categories[0]._id, brand: 'Dell', stock: 30, images: ['https://placehold.co/800x800/1a252f/FEBD69?text=Dell+XPS'], thumbnail: 'https://placehold.co/400x400/1a252f/FEBD69?text=Dell+XPS', featured: true, tags: ['laptop'] },
    { name: 'ASUS ROG Zephyrus', shortDescription: 'RTX 4060, Ryzen 9', description: 'Gaming laptop', price: 1599, comparePrice: 1799, category: categories[0]._id, brand: 'ASUS', stock: 15, images: ['https://placehold.co/800x800/2d3a4a/FF6B6B?text=ASUS+ROG'], thumbnail: 'https://placehold.co/400x400/2d3a4a/FF6B6B?text=ASUS+ROG', featured: false, tags: ['gaming'] },
    { name: 'iPhone 15 Pro Max', shortDescription: 'A17 Pro, 256GB', description: 'Titanium design', price: 1199, comparePrice: 1299, category: categories[1]._id, brand: 'Apple', stock: 50, images: ['https://placehold.co/800x800/1C1C1E/FFFFFF?text=iPhone+15'], thumbnail: 'https://placehold.co/400x400/1C1C1E/FFFFFF?text=iPhone+15', featured: true, tags: ['phone'] },
    { name: 'Galaxy S24 Ultra', shortDescription: 'Snapdragon 8 Gen 3', description: 'Galaxy AI', price: 1299, comparePrice: 1399, category: categories[1]._id, brand: 'Samsung', stock: 40, images: ['https://placehold.co/800x800/4A148C/FFFFFF?text=Galaxy+S24'], thumbnail: 'https://placehold.co/400x400/4A148C/FFFFFF?text=Galaxy+S24', featured: true, tags: ['phone'] },
    { name: 'Google Pixel 8 Pro', shortDescription: 'Tensor G3, AI', description: 'Best Pixel camera', price: 999, comparePrice: 1099, category: categories[1]._id, brand: 'Google', stock: 25, images: ['https://placehold.co/800x800/E8F5E9/1B5E20?text=Pixel+8'], thumbnail: 'https://placehold.co/400x400/E8F5E9/1B5E20?text=Pixel+8', featured: false, tags: ['phone'] },
    { name: 'Sony BRAVIA 65" OLED', shortDescription: '4K 120Hz', description: 'QD-OLED TV', price: 2999, comparePrice: 3499, category: categories[2]._id, brand: 'Sony', stock: 15, images: ['https://placehold.co/800x800/0D0D0D/00E5FF?text=Sony+TV'], thumbnail: 'https://placehold.co/400x400/0D0D0D/00E5FF?text=Sony+TV', featured: true, tags: ['tv'] },
    { name: 'LG C3 55" OLED', shortDescription: 'OLED evo, G-SYNC', description: 'Perfect for gaming', price: 1499, comparePrice: 1799, category: categories[2]._id, brand: 'LG', stock: 20, images: ['https://placehold.co/800x800/A50034/FFFFFF?text=LG+OLED'], thumbnail: 'https://placehold.co/400x400/A50034/FFFFFF?text=LG+OLED', featured: false, tags: ['tv'] },
    { name: 'PlayStation 5', shortDescription: '825GB SSD', description: 'Next-gen gaming', price: 499, comparePrice: 549, category: categories[4]._id, brand: 'Sony', stock: 35, images: ['https://placehold.co/800x800/00439C/FFFFFF?text=PS5'], thumbnail: 'https://placehold.co/400x400/00439C/FFFFFF?text=PS5', featured: true, tags: ['gaming'] },
    { name: 'Xbox Series X', shortDescription: '1TB SSD, 12TF', description: 'Most powerful Xbox', price: 499, comparePrice: 549, category: categories[4]._id, brand: 'Microsoft', stock: 30, images: ['https://placehold.co/800x800/107C10/FFFFFF?text=Xbox'], thumbnail: 'https://placehold.co/400x400/107C10/FFFFFF?text=Xbox', featured: true, tags: ['gaming'] },
    { name: 'AirPods Pro 2', shortDescription: 'ANC, USB-C', description: 'Spatial Audio', price: 249, comparePrice: 279, category: categories[5]._id, brand: 'Apple', stock: 100, images: ['https://placehold.co/800x800/F5F5F7/1D1D1F?text=AirPods'], thumbnail: 'https://placehold.co/400x400/F5F5F7/1D1D1F?text=AirPods', featured: true, tags: ['audio'] },
    { name: 'Sony WH-1000XM5', shortDescription: '30hr, ANC', description: 'Best headphones', price: 349, comparePrice: 399, category: categories[5]._id, brand: 'Sony', stock: 45, images: ['https://placehold.co/800x800/1A1A1A/C8C8C8?text=Sony+XM5'], thumbnail: 'https://placehold.co/400x400/1A1A1A/C8C8C8?text=Sony+XM5', featured: false, tags: ['audio'] },
  ]);
  
  // Create admin user
  const adminPwd = await bcrypt.hash('admin123', 10);
  await User.create({ name: 'Admin', email: 'admin@electro.com', password: adminPwd, role: 'admin', wishlist: [] });
  
  // Create regular user
  const userPwd = await bcrypt.hash('user123', 10);
  await User.create({ name: 'John Doe', email: 'user@electro.com', password: userPwd, role: 'user', wishlist: [] });
  
  console.log('✅ Firebase seeded!');
  console.log('   Admin: admin@electro.com / admin123');
  console.log('   User: user@electro.com / user123');
}

export default { User, Category, Product, Cart, Order, initFirestore, getFirestore };

