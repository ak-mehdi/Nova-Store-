# Electro E-Commerce Store

A production-ready full-stack e-commerce store built with the MERN stack (MongoDB, Express, React, Node.js), featuring a modern UI inspired by the Electro Electronics Store theme.

## Features

### Customer Features
- **Product Browsing**: Browse products with advanced filtering, sorting, and search
- **Product Details**: View detailed product information, specifications, and reviews
- **Shopping Cart**: Add items to cart with persistent storage
- **User Authentication**: Register, login, and manage your account
- **Checkout**: Multi-step checkout with address management
- **Payment Integration**: Stripe and PayPal payment support
- **Order Tracking**: View order history and track order status
- **Wishlist**: Save favorite products for later

### Admin Features
- **Dashboard**: Analytics overview with charts and statistics
- **Product Management**: CRUD operations for products
- **Category Management**: Organize products into categories
- **Order Management**: View and update order statuses
- **User Management**: Manage customer accounts

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Stripe/PayPal** - Payment processing
- **Cloudinary** - Image hosting
- **Nodemailer** - Email notifications

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router 6** - Routing
- **Tailwind CSS** - Styling
- **Swiper** - Carousels
- **Recharts** - Admin charts
- **React Hot Toast** - Notifications

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ecommerce-store
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Configure Backend Environment**
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/electro-ecommerce
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# PayPal
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
```

4. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

5. **Configure Frontend Environment**
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Seed the Database** (optional)
```bash
cd backend
npm run seed
```

3. **Start Backend Server**
```bash
cd backend
npm run dev
```

4. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### Demo Credentials
After seeding the database:
- **Admin**: admin@electro.com / admin123
- **User**: user@electro.com / user123

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## Project Structure

```
ecommerce-store/
├── backend/
│   ├── config/         # Database and cloudinary config
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── redux/      # State management
│   │   ├── hooks/      # Custom hooks
│   │   └── utils/      # Helper functions
│   └── index.html
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove cart item

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

### Admin
- `GET /api/admin/analytics` - Get dashboard analytics
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

