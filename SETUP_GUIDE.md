# Step-by-Step Setup Guide for Pawfect Pets

This guide will walk you through getting the app running locally on your machine.

## Prerequisites Check

Before starting, make sure you have:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **npm** (comes with Node.js) or **yarn**

### Verify Installation

Open a terminal and run:
```bash
node --version    # Should be v18 or higher
npm --version     # Should be 9.x or higher
psql --version    # Should show PostgreSQL version
```

## Step 1: Install Dependencies

1. Open a terminal in the project root directory (`pawfect-pets`)
2. Run the install script:

```bash
npm run install:all
```

This will install dependencies for:
- Root project (concurrently)
- Server (Express, Sequelize, etc.)
- Client (React, Vite, etc.)

**Expected time**: 2-5 minutes depending on your internet speed

## Step 2: Set Up PostgreSQL Database

### Option A: Using psql (Command Line)

1. Open a terminal
2. Connect to PostgreSQL:
```bash
psql -U postgres
```

3. Create the database:
```sql
CREATE DATABASE pawfect_pets;
\q
```

### Option B: Using pgAdmin (GUI)

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name it: `pawfect_pets`
5. Click "Save"

### Option C: Using createdb command

```bash
createdb -U postgres pawfect_pets
```

## Step 3: Configure Environment Variables

1. Navigate to the `server` directory:
```bash
cd server
```

2. Create a `.env` file (copy from the example):
```bash
# On Windows (PowerShell)
Copy-Item env.example .env

# On Mac/Linux
cp env.example .env
```

3. Open the `.env` file in a text editor and update these values:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pawfect_pets
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD

# JWT Secret (change this to a random string)
JWT_SECRET=my_super_secret_jwt_key_12345
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Origin
CLIENT_URL=http://localhost:3000
```

**Important**: Replace `YOUR_POSTGRES_PASSWORD` with your actual PostgreSQL password (the one you set during PostgreSQL installation).

## Step 4: Seed the Database

1. Make sure you're in the `server` directory:
```bash
cd server
```

2. Run the seed script:
```bash
npm run db:seed
```

This will:
- Create all database tables
- Create an admin user: `admin@pawfectpets.com` / `admin123`
- Create a test user: `user@pawfectpets.com` / `user123`
- Add sample products and services

**Expected output**:
```
Database connection established.
Database synced.
Admin user created: admin
Test user created: testuser
Created 6 products.
Created 5 services.
Database seeded successfully!
```

## Step 5: Start the Application

1. Go back to the project root directory:
```bash
cd ..
```

2. Start both frontend and backend:
```bash
npm run dev
```

This will start:
- **Backend server** on http://localhost:5000
- **Frontend app** on http://localhost:3000

**Expected output**:
```
[0] Database connection established successfully.
[0] Database models synchronized.
[0] Server is running on port 5000
[1] VITE v5.0.8  ready in 500 ms
[1] ➜  Local:   http://localhost:3000/
```

## Step 6: Open the Application

1. Open your web browser
2. Navigate to: **http://localhost:3000**

You should see the Pawfect Pets homepage!

## Step 7: Test the Application

### As a Regular User:

1. **Browse Products**:
   - Click "Shop" in the navbar
   - Browse the products
   - Click "Add to Cart" on any product

2. **View Cart**:
   - Click the cart icon in the navbar
   - See your items in the cart

3. **Register/Login**:
   - Click "Sign Up" to create a new account
   - Or click "Login" and use: `user@pawfectpets.com` / `user123`

4. **Checkout**:
   - After logging in, add items to cart
   - Click "Cart" → "Checkout"
   - Order will be placed and visible in Dashboard

5. **Book a Service**:
   - Click "Services" in the navbar
   - Click "Book Now" on any service
   - Select date and time
   - Submit booking

6. **View Dashboard**:
   - Click "Dashboard" in the navbar
   - See your orders and bookings

### As an Admin:

1. **Login as Admin**:
   - Click "Login"
   - Use: `admin@pawfectpets.com` / `admin123`

2. **Access Admin Dashboard**:
   - Click "Admin" in the navbar
   - You'll see tabs for Products and Services

3. **Add a Product**:
   - Click "Add Product"
   - Fill in the form (name, description, price, etc.)
   - Click "Save"

4. **Edit/Delete Products**:
   - Click "Edit" or "Delete" on any product card

5. **Manage Services**:
   - Switch to "Services" tab
   - Add, edit, or delete services

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution**:
1. Make sure PostgreSQL is running:
   ```bash
   # On Windows (check Services)
   # On Mac
   brew services list
   # On Linux
   sudo systemctl status postgresql
   ```

2. Verify your database credentials in `server/.env`
3. Test connection:
   ```bash
   psql -U postgres -d pawfect_pets
   ```

### Issue: "Port 5000 already in use"

**Solution**:
1. Change the port in `server/.env`:
   ```env
   PORT=5001
   ```
2. Update `client/vite.config.ts` proxy target if needed

### Issue: "Port 3000 already in use"

**Solution**:
1. Change the port in `client/vite.config.ts`:
   ```typescript
   server: {
     port: 3001,
     // ...
   }
   ```

### Issue: "Module not found" errors

**Solution**:
1. Delete `node_modules` folders:
   ```bash
   rm -rf node_modules server/node_modules client/node_modules
   # On Windows: use File Explorer or:
   rmdir /s node_modules server\node_modules client\node_modules
   ```

2. Reinstall:
   ```bash
   npm run install:all
   ```

### Issue: Database seed fails

**Solution**:
1. Make sure the database exists:
   ```sql
   psql -U postgres -l
   ```

2. If it doesn't exist, create it:
   ```sql
   CREATE DATABASE pawfect_pets;
   ```

3. Check your `.env` file has correct credentials

### Issue: "JWT_SECRET is not defined"

**Solution**:
1. Make sure `server/.env` file exists
2. Make sure it has `JWT_SECRET=some_random_string`

## Stopping the Application

Press `Ctrl + C` in the terminal where `npm run dev` is running.

## Next Steps

- Explore the codebase
- Customize the styling in `client/tailwind.config.js`
- Add your own products via the admin dashboard
- Check out the API routes in `server/src/routes/`
- Read the full documentation in `README.md`

## Need Help?

If you encounter any issues:
1. Check the error message in the terminal
2. Verify all prerequisites are installed
3. Make sure database is running and accessible
4. Check that `.env` file is correctly configured
5. Review the troubleshooting section above

Enjoy exploring Pawfect Pets! 🐾

