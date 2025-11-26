# 🐾 Complete Local Setup Walkthrough

This guide will walk you through every step to get Pawfect Pets running on your local machine.

## 🔍 Prerequisites Check

First, let's verify what you have installed.

### Step 0.1: Check Node.js

Open a terminal (PowerShell on Windows, Terminal on Mac/Linux) and run:

```bash
node --version
```

**If you see a version number (v18 or higher):** ✅ You're good!
**If you see "command not found":** ❌ You need to install Node.js

**To install Node.js:**
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer
4. Restart your terminal
5. Verify: `node --version`

### Step 0.2: Check npm

```bash
npm --version
```

**If you see a version number:** ✅ You're good!
**If you see "command not found":** ❌ npm should come with Node.js, try reinstalling Node.js

### Step 0.3: Check PostgreSQL

```bash
psql --version
```

**If you see a version number:** ✅ You're good!
**If you see "command not found":** ❌ You need to install PostgreSQL

**To install PostgreSQL:**
1. Go to https://www.postgresql.org/download/
2. Download for your operating system
3. Run the installer
   - **Important:** Remember the password you set for the `postgres` user!
   - Default port is usually 5432 (keep this)
4. Verify: `psql --version`

---

## 📦 Step 1: Install Project Dependencies

1. Open a terminal in the project root directory (`pawfect-pets`)

2. Install all dependencies:

```bash
npm run install:all
```

**What this does:**
- Installs root dependencies (concurrently)
- Installs server dependencies (Express, Sequelize, etc.)
- Installs client dependencies (React, Vite, etc.)

**Expected output:**
```
added 50 packages in 30s
...
added 200 packages in 2m
...
```

**Time:** 2-5 minutes depending on internet speed

**Troubleshooting:**
- If you get errors, make sure you're in the project root directory
- Try: `npm install` first, then `cd server && npm install`, then `cd ../client && npm install`

---

## 🗄️ Step 2: Set Up PostgreSQL Database

### Step 2.1: Start PostgreSQL

Make sure PostgreSQL is running on your system.

**Windows:**
- Open Services (Win + R → `services.msc`)
- Find "postgresql" service
- Make sure it's "Running"

**Mac:**
```bash
brew services list
# Should show postgresql as started
```

**Linux:**
```bash
sudo systemctl status postgresql
# Should show active (running)
```

### Step 2.2: Create the Database

**Option A: Using psql (Recommended)**

1. Open a terminal
2. Connect to PostgreSQL:

```bash
psql -U postgres
```

3. Enter your PostgreSQL password (the one you set during installation)

4. Create the database:

```sql
CREATE DATABASE pawfect_pets;
```

5. Verify it was created:

```sql
\l
```

You should see `pawfect_pets` in the list.

6. Exit psql:

```sql
\q
```

**Option B: Using createdb command**

```bash
createdb -U postgres pawfect_pets
```

Enter your password when prompted.

**Option C: Using pgAdmin (GUI)**

1. Open pgAdmin
2. Connect to your PostgreSQL server (enter password)
3. Right-click on "Databases" → "Create" → "Database"
4. Database name: `pawfect_pets`
5. Click "Save"

---

## ⚙️ Step 3: Configure Environment Variables

### Step 3.1: Create .env File

**Windows (PowerShell):**
```powershell
cd server
Copy-Item env.example .env
```

**Mac/Linux:**
```bash
cd server
cp env.example .env
```

### Step 3.2: Edit .env File

1. Open `server/.env` in a text editor (Notepad, VS Code, etc.)

2. Update these values:

```env
# Replace YOUR_POSTGRES_PASSWORD with your actual PostgreSQL password
DB_PASSWORD=YOUR_POSTGRES_PASSWORD

# You can change this to any random string (keep it secret!)
JWT_SECRET=my_super_secret_jwt_key_12345
```

**Complete .env file should look like:**

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

**Important Notes:**
- `DB_PASSWORD` must match your PostgreSQL password
- `JWT_SECRET` can be any random string (used for encryption)
- Don't commit the `.env` file to git (it's already in .gitignore)

---

## 🌱 Step 4: Seed the Database

1. Make sure you're in the `server` directory:

```bash
cd server
```

2. Run the seed script:

```bash
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

**What this does:**
- Creates all database tables (Users, Products, Services, Orders, Bookings)
- Creates an admin user: `admin@pawfectpets.com` / `admin123`
- Creates a test user: `user@pawfectpets.com` / `user123`
- Adds 6 sample products
- Adds 5 sample services

**Troubleshooting:**

If you get "Cannot connect to database":
1. Check PostgreSQL is running
2. Verify your password in `.env` file
3. Test connection: `psql -U postgres -d pawfect_pets`

If you get "database does not exist":
1. Go back to Step 2 and create the database

---

## 🚀 Step 5: Start the Application

1. Go back to the project root directory:

```bash
cd ..
```

2. Start both frontend and backend:

```bash
npm run dev
```

**Expected output:**
```
[0] Database connection established successfully.
[0] Database models synchronized.
[0] Server is running on port 5000
[0] Environment: development
[1] 
[1]   VITE v5.0.8  ready in 500 ms
[1] 
[1]   ➜  Local:   http://localhost:3000/
[1]   ➜  Network: use --host to expose
[1]   ➜  press h to show help
```

**What's running:**
- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:3000

**Keep this terminal open!** The app runs as long as this terminal is open.

---

## 🌐 Step 6: Open the Application

1. Open your web browser (Chrome, Firefox, Edge, etc.)

2. Navigate to: **http://localhost:3000**

3. You should see the Pawfect Pets homepage! 🎉

**What you'll see:**
- Hero section with "Welcome to Pawfect Pets"
- Featured Products section
- Featured Services section
- Navigation bar with Shop, Services, Login, etc.

---

## 🧪 Step 7: Test the Application

### Test 1: Browse Products

1. Click **"Shop"** in the navbar
2. You should see 6 products
3. Click **"Add to Cart"** on any product
4. See the cart icon update with item count

### Test 2: View Cart

1. Click the **cart icon** in the navbar (🛒)
2. You should see your selected products
3. See the total price

### Test 3: Register a New User

1. Click **"Sign Up"** in the navbar
2. Fill in the form:
   - Username: `testuser2`
   - Email: `test2@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click **"Sign Up"**
4. You should be redirected to the Dashboard

### Test 4: Login with Test Account

1. Click **"Login"** (or logout first if you're logged in)
2. Enter:
   - Email: `user@pawfectpets.com`
   - Password: `user123`
3. Click **"Login"**
4. You should see "Hello, testuser" in the navbar

### Test 5: Add to Cart and Checkout

1. Go to **"Shop"**
2. Add multiple products to cart
3. Click **"Cart"** → Click **"Checkout"**
4. You should see a success message
5. Go to **"Dashboard"** to see your order

### Test 6: Book a Service

1. Click **"Services"** in the navbar
2. You should see 5 services
3. Click **"Book Now"** on any service
4. Fill in the booking form:
   - Date: Select a future date
   - Time: Select a time
   - Notes: (optional) "Test booking"
5. Click **"Book Now"**
6. You should see a success message
7. Go to **"Dashboard"** to see your booking

### Test 7: Admin Dashboard

1. **Logout** if you're logged in
2. Click **"Login"**
3. Enter admin credentials:
   - Email: `admin@pawfectpets.com`
   - Password: `admin123`
4. Click **"Login"**
5. You should see **"Admin"** in the navbar
6. Click **"Admin"**
7. You should see two tabs: **Products** and **Services**
8. Try:
   - Click **"Add Product"** → Fill form → Save
   - Click **"Edit"** on a product → Update → Save
   - Click **"Delete"** on a product → Confirm
   - Switch to **Services** tab and do the same

---

## 🛑 Stopping the Application

When you're done testing:

1. Go to the terminal where `npm run dev` is running
2. Press **Ctrl + C**
3. Confirm if prompted (usually not needed)

The application will stop.

---

## 🔧 Common Issues and Solutions

### Issue: "Cannot connect to database"

**Symptoms:**
- Error when running `npm run db:seed`
- Error when starting server: "Unable to connect to the database"

**Solutions:**
1. **Check PostgreSQL is running:**
   - Windows: Services → postgresql → Should be "Running"
   - Mac: `brew services list` → Should show started
   - Linux: `sudo systemctl status postgresql` → Should show active

2. **Verify database exists:**
   ```bash
   psql -U postgres -l
   ```
   Should show `pawfect_pets` in the list

3. **Check .env file:**
   - Make sure `DB_PASSWORD` matches your PostgreSQL password
   - Make sure `DB_NAME=pawfect_pets`
   - Make sure `DB_USER=postgres`

4. **Test connection:**
   ```bash
   psql -U postgres -d pawfect_pets
   ```
   If this works, your credentials are correct

### Issue: "Port 5000 already in use"

**Symptoms:**
- Error: "Port 5000 is already in use"

**Solutions:**
1. **Find what's using port 5000:**
   - Windows: `netstat -ano | findstr :5000`
   - Mac/Linux: `lsof -i :5000`

2. **Kill the process** or **change the port:**
   - Edit `server/.env`: Change `PORT=5000` to `PORT=5001`
   - Edit `client/vite.config.ts`: Update proxy target if needed

### Issue: "Port 3000 already in use"

**Symptoms:**
- Error: "Port 3000 is already in use"

**Solutions:**
1. **Change the port:**
   - Edit `client/vite.config.ts`:
     ```typescript
     server: {
       port: 3001,  // Change from 3000
     }
     ```
   - Access app at http://localhost:3001

### Issue: "Module not found" errors

**Symptoms:**
- Error: "Cannot find module 'xxx'"
- Error when starting server or client

**Solutions:**
1. **Delete node_modules and reinstall:**
   ```bash
   # Windows (PowerShell)
   Remove-Item -Recurse -Force node_modules, server/node_modules, client/node_modules
   
   # Mac/Linux
   rm -rf node_modules server/node_modules client/node_modules
   ```

2. **Reinstall:**
   ```bash
   npm run install:all
   ```

### Issue: Database seed fails

**Symptoms:**
- Error when running `npm run db:seed`
- "Database does not exist" or connection error

**Solutions:**
1. **Make sure database exists:**
   ```sql
   psql -U postgres
   \l  -- List databases
   ```
   If `pawfect_pets` is not listed, create it:
   ```sql
   CREATE DATABASE pawfect_pets;
   ```

2. **Check .env file:**
   - Verify all database credentials are correct
   - Make sure there are no extra spaces or quotes

3. **Try manual connection:**
   ```bash
   psql -U postgres -d pawfect_pets
   ```
   If this doesn't work, fix your PostgreSQL setup first

### Issue: "JWT_SECRET is not defined"

**Symptoms:**
- Error: "JWT_SECRET is not defined"
- Authentication doesn't work

**Solutions:**
1. **Check .env file exists:**
   - Make sure `server/.env` exists
   - Not `server/env.example`

2. **Check JWT_SECRET is set:**
   ```env
   JWT_SECRET=my_super_secret_jwt_key_12345
   ```

3. **Restart the server** after creating/editing .env

---

## 📚 Next Steps

Now that you have the app running:

1. **Explore the code:**
   - Backend: `server/src/`
   - Frontend: `client/src/`

2. **Customize:**
   - Styling: `client/tailwind.config.js`
   - Add products via admin dashboard
   - Modify API routes: `server/src/routes/`

3. **Learn:**
   - Read the code comments
   - Check out the README.md
   - Explore the API routes

4. **Extend:**
   - Add new features
   - Integrate Stripe for payments
   - Add Petfinder API for adoptable dogs
   - Add reviews and ratings

---

## ✅ Checklist

Use this checklist to make sure you've completed everything:

- [ ] Node.js installed (v18+)
- [ ] npm installed
- [ ] PostgreSQL installed and running
- [ ] Database `pawfect_pets` created
- [ ] `.env` file created in `server/` directory
- [ ] Database seeded (`npm run db:seed`)
- [ ] Application started (`npm run dev`)
- [ ] App opens in browser (http://localhost:3000)
- [ ] Can browse products
- [ ] Can register/login
- [ ] Can add to cart and checkout
- [ ] Can book services
- [ ] Can access admin dashboard

---

## 🎉 You're All Set!

Congratulations! You now have Pawfect Pets running locally. Enjoy exploring the application!

If you encounter any issues not covered here, check:
1. The error message in the terminal
2. The browser console (F12 → Console tab)
3. The SETUP_GUIDE.md for more troubleshooting

Happy coding! 🐾

