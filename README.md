# Pawfect Pets - Dog Business Platform

A full-stack web application for browsing, purchasing, and booking dog-related services and products.

## Features

- **Online Store**: Browse and purchase dog supplies, food, and accessories
- **Service Bookings**: Book dog walking, boarding, training, and grooming services
- **User Dashboard**: View past orders and upcoming appointments
- **Admin Dashboard**: Manage products and services (CRUD operations)
- **Authentication**: Secure signup/login with JWT authentication
- **Shopping Cart**: Add products to cart and checkout

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- TailwindCSS for styling
- Axios for API calls
- Vite for build tooling

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL database
- Sequelize ORM
- JWT authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd pawfect-pets
```

### 2. Install dependencies

```bash
npm run install:all
```

This will install dependencies for the root, server, and client directories.

### 3. Set up the database

1. Create a PostgreSQL database:
```bash
createdb pawfect_pets
```

2. Update the database configuration in `server/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pawfect_pets
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

3. Create the `.env` file in the `server` directory:
```bash
cd server
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Seed the database

```bash
cd server
npm run db:seed
```

This will create:
- An admin user (email: `admin@pawfectpets.com`, password: `admin123`)
- A test user (email: `user@pawfectpets.com`, password: `user123`)
- Sample products and services

### 5. Run the application

#### Development mode (runs both frontend and backend):

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

#### Or run separately:

**Backend only:**
```bash
npm run server:dev
```

**Frontend only:**
```bash
npm run client:dev
```

## Project Structure

```
pawfect-pets/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth, Cart)
│   │   ├── utils/         # Utility functions (API calls)
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── config/        # Database configuration
│   │   ├── seeders/       # Database seeders
│   │   └── server.ts      # Entry point
│   └── package.json
└── package.json           # Root package.json
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Orders
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `POST /api/orders` - Create order (protected)

### Bookings
- `GET /api/bookings` - Get user's bookings (protected)
- `GET /api/bookings/:id` - Get single booking (protected)
- `POST /api/bookings` - Create booking (protected)
- `PUT /api/bookings/:id` - Update booking (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)

## Database Models

- **User**: Users with authentication (username, email, password, role)
- **Product**: Products for sale (name, description, price, image, category, stock)
- **Service**: Services offered (name, description, price, duration, category)
- **Order**: User orders (userId, total, status)
- **OrderItem**: Order line items (orderId, productId, quantity, price)
- **Booking**: Service bookings (userId, serviceId, date, time, status)

## Testing

### Backend tests:
```bash
cd server
npm test
```

### Frontend tests:
```bash
cd client
npm test
```

## Deployment

### Prepare for deployment on Render

1. **Backend (Render):**
   - Set up a PostgreSQL database on Render
   - Set environment variables in Render dashboard
   - Build command: `npm run build`
   - Start command: `npm start`

2. **Frontend (Render):**
   - Build command: `npm run build`
   - Start command: `npm run preview`
   - Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`

3. **Environment Variables for Production:**
   - Update `CLIENT_URL` in backend to your frontend URL
   - Set `NODE_ENV=production`
   - Use a strong `JWT_SECRET`

## Default Users

After seeding the database:

- **Admin**: `admin@pawfectpets.com` / `admin123`
- **User**: `user@pawfectpets.com` / `user123`

## Future Enhancements

- Stripe payment integration
- Petfinder API integration for adoptable dogs
- Reviews and ratings for products and services
- Email notifications for bookings and orders
- Image upload functionality
- Advanced search and filtering
- Wishlist functionality

## License

ISC

## Contributing

This is a solo developer project. Feel free to fork and modify for your own use.

## Support

For issues or questions, please open an issue on the repository.

# pawfect-pets
