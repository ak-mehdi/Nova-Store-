import admin from 'firebase-admin';

// Initialize Firebase with default credentials (uses GOOGLE_APPLICATION_CREDENTIALS env var)
// Or initialize with inline config for demo purposes
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'electro-ecommerce-demo',
  // For production, use service account key file
};

let db;

export const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length === 0) {
      // Try to initialize with service account if available
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else {
        // Initialize with project ID only (for emulator or default credentials)
        admin.initializeApp({
          projectId: firebaseConfig.projectId
        });
      }
      console.log('🔥 Firebase Admin initialized');
    }
    
    db = admin.firestore();
    
    // Use emulator in development if no credentials
    if (process.env.NODE_ENV === 'development' && !process.env.FIREBASE_SERVICE_ACCOUNT) {
      db.settings({
        host: 'localhost:8080',
        ssl: false
      });
      console.log('📦 Using Firestore Emulator at localhost:8080');
    }
    
    return db;
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    throw error;
  }
};

export const getDb = () => {
  if (!db) {
    return initializeFirebase();
  }
  return db;
};

export default admin;

