# 🐾 Pawfect Pets - Quick Start Guide

Follow these steps to get the app running locally.

## Step 1: Verify Prerequisites

Make sure you have these installed:

```bash
node --version    # Should be v18+
npm --version     # Should be 9.x+
psql --version    # Should show PostgreSQL version
```

**Don't have them?**
- Node.js: https://nodejs.org/
- PostgreSQL: https://www.postgresql.org/download/

## Step 2: Install Dependencies

In the project root directory, run:

```bash
npm run install:all
```

This installs all dependencies for root, server, and client. **Takes 2-5 minutes.**

## Step 3: Set Up Database

### Create the Database

**Option 1: Using psql (Recommended)**
```bash
psql -U postgres
```
Then in psql:
```sql
CREATE DATABASE pawfect_pets;
\q
```

**Option 2: Using createdb command**
```bash
createdb -U postgres pawfect_pets
```

**Option 3: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `pawfect_pets`
4. Save

## Step 4: Create .env File

### Windows (PowerShell):
```powershell
cd server
Copy-Item env.example .env
```

### Mac/Linux:
```bash
cd server
cp env.example .env
```

### Then Edit .env:

Open `server/.env` in a text editor and update:

```env
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
JWT_SECRET=my_super_secret_jwt_key_12345
```

Replace `YOUR_POSTGRES_PASSWORD` with your actual PostgreSQL password.

**Full .env file should look like:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pawfect_pets
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
JWT_SECRET=my_super_secret_jwt_key_12345
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## Step 5: Seed the Database

```bash
cd server
npm run db:seed
```

**Expected output:**
```
Database connection established.
Database synced.
Admin user created: admin
Test user created: testuser
Created 6 products.
Created 5 services.
Database seeded successfully!
```

## Step 6: Start the App

Go back to root directory and run:

```bash
cd ..
npm run dev
```

This starts both frontend (port 3000) and backend (port 5000).

## Step 7: Open in Browser

Open: **http://localhost:3000**

You should see the Pawfect Pets homepage! 🎉

## Test Accounts

After seeding, you can login with:

**Admin:**
- Email: `admin@pawfectpets.com`
- Password: `admin123`

**User:**
- Email: `user@pawfectpets.com`
- Password: `user123`

## What to Try

1. **Browse Products**: Click "Shop" → Add items to cart
2. **Book Services**: Click "Services" → Book a service
3. **Login**: Click "Login" → Use test account
4. **Checkout**: Add items to cart → Checkout
5. **Dashboard**: View your orders and bookings
6. **Admin**: Login as admin → Manage products/services

## Troubleshooting

### "Cannot connect to database"
- Make sure PostgreSQL is running
- Check your password in `.env` file
- Verify database exists: `psql -U postgres -l`

### "Port already in use"
- Change PORT in `server/.env` (backend)
- Change port in `client/vite.config.ts` (frontend)

### "Module not found"
```bash
# Delete node_modules and reinstall
rm -rf node_modules server/node_modules client/node_modules
npm run install:all
```

## Need More Help?

See `SETUP_GUIDE.md` for detailed troubleshooting.

## Stop the App

Press `Ctrl + C` in the terminal.

---

**Ready to start? Begin with Step 1!** 🚀

