# 🔧 How to Run the Seeder - Fix Images Issue

The images aren't showing because **the database hasn't been updated** with the new image URLs. You need to run the seeder, but first MongoDB needs to be running.

---

## 🚨 Your Issue
MongoDB is not running! Choose ONE of these options to fix it:

---

## Option 1: Install MongoDB Locally (Recommended)

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Download **MongoDB Community Server** for Windows
3. Run the installer (choose "Complete" installation)
4. ✅ Check "Install MongoDB as a Service"

### Step 2: Start MongoDB
After installation, MongoDB should start automatically. If not:
```bash
net start MongoDB
```

### Step 3: Run the Seeder
```bash
cd "D:\ecommerce store task\backend"
node utils/quickSeed.js
```

---

## Option 2: Use MongoDB Atlas (Free Cloud - No Install)

### Step 1: Create Free Account
1. Go to: https://cloud.mongodb.com
2. Click "Try Free" and sign up
3. Create a **FREE** cluster (M0 tier)

### Step 2: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/electro-store
   ```

### Step 3: Create .env File
Create a file `backend/.env` with:
```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/electro-store
JWT_SECRET=your_secret_key_here
PORT=5000
```

### Step 4: Run the Seeder
```bash
cd "D:\ecommerce store task\backend"
node utils/seedWithAtlas.js
```

---

## Option 3: Use Docker (If You Have Docker Desktop)

### Step 1: Install Docker Desktop
Download from: https://www.docker.com/products/docker-desktop/

### Step 2: Start MongoDB Container
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### Step 3: Run the Seeder
```bash
cd "D:\ecommerce store task\backend"
node utils/quickSeed.js
```

---

## 🎯 Quick Fix Command (After MongoDB is Running)

Once MongoDB is running, run this single command:

```powershell
cd "D:\ecommerce store task\backend"; node utils/quickSeed.js
```

### Expected Output:
```
✅ MongoDB Connected
✅ Data cleared
✅ Users created
✅ Categories created
✅ Products created

🎉 DATABASE SEEDED SUCCESSFULLY!

📊 Summary:
   - 6 categories
   - 18 products
   - 2 users

🔐 Login credentials:
   Admin: admin@electro.com / admin123
   User: user@electro.com / user123
```

---

## 📝 After Seeding - Restart Everything

### 1. Kill existing Node processes
```powershell
taskkill /F /IM node.exe
```

### 2. Start Backend
```powershell
cd "D:\ecommerce store task\backend"
npm start
```

### 3. Start Frontend (new terminal)
```powershell
cd "D:\ecommerce store task\frontend"
npm run dev
```

### 4. Hard Refresh Browser
Press `Ctrl + Shift + R` in your browser to clear cache.

---

## ✅ Verify Images Are Working

After seeding, visit http://localhost:5173 and you should see:

1. **Home Page** - Hero slider with real images
2. **Categories** - 6 categories with banner images
3. **Products** - All products with correct images:
   - 💻 MacBook, Dell XPS, ASUS ROG
   - 📱 iPhone, Samsung, Pixel, Fire Tablet
   - 📺 Sony TV, LG OLED
   - 📷 Sony Camera, Canon
   - 🎮 PS5, Xbox, Switch
   - 🎧 AirPods, Sony Headphones, Gaming Headset, Mouse

---

## 🐛 Still Not Working?

### Check if MongoDB is Running
```powershell
# Option 1: Check service
Get-Service MongoDB

# Option 2: Try to connect
mongosh
```

### Check Backend Logs
Look for errors in the terminal where backend is running.

### Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

---

## 🎨 Image URLs Being Used

All images are from **Unsplash** (free, high-quality):

| Product | Image Type |
|---------|-----------|
| MacBook Pro | Silver laptop on desk |
| Dell XPS | Modern laptop |
| ASUS ROG | Gaming laptop |
| iPhone 15 | Blue iPhone |
| Samsung S24 | Samsung phone |
| Pixel 8 | Google Pixel |
| Fire Tablet | Tablet device |
| Sony TV | OLED TV |
| LG TV | Smart TV |
| Sony Camera | DSLR camera |
| Canon Camera | Mirrorless |
| PS5 | PlayStation console |
| Xbox | Xbox console |
| Switch | Nintendo handheld |
| AirPods | White earbuds |
| Headphones | Over-ear |
| Gaming Headset | RGB headset |
| Mouse | Wireless mouse |

---

## 🚀 Quick Summary

1. **Install/Start MongoDB** (Option 1, 2, or 3 above)
2. **Run Seeder**: `node utils/quickSeed.js`
3. **Restart Servers**: Kill node, start backend, start frontend
4. **Hard Refresh**: Ctrl+Shift+R in browser

**That's it!** Your images will appear correctly.

