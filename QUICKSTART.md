# Quick Start Guide

## Prerequisites
- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn

## Setup (5 minutes)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Set Up Database
```bash
# Create PostgreSQL database
createdb pawfect_pets

# Or using psql:
psql -U postgres
CREATE DATABASE pawfect_pets;
\q
```

### 3. Configure Environment
```bash
cd server
# Create .env file from example
# Copy the contents of env.example to .env
# Update with your database credentials
```

Edit `server/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pawfect_pets
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Seed Database
```bash
cd server
npm run db:seed
```

This creates:
- Admin user: `admin@pawfectpets.com` / `admin123`
- Test user: `user@pawfectpets.com` / `user123`
- Sample products and services

### 5. Run Application
```bash
# From root directory
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Test the Application

1. **Browse Products**: Visit http://localhost:3000/shop
2. **View Services**: Visit http://localhost:3000/services
3. **Login**: Use `user@pawfectpets.com` / `user123`
4. **Admin Access**: Use `admin@pawfectpets.com` / `admin123` to access admin dashboard

## Common Issues

### Database Connection Error
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database `pawfect_pets` exists

### Port Already in Use
- Change `PORT` in `server/.env` (backend)
- Change port in `client/vite.config.ts` (frontend)

### Module Not Found
- Run `npm run install:all` again
- Delete `node_modules` and reinstall

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check API routes in `server/src/routes/`
- Customize styling in `client/tailwind.config.js`
- Add your own products/services via admin dashboard

## Development Tips

- Backend logs: Check terminal running `npm run server:dev`
- Frontend hot reload: Changes auto-reload in browser
- Database: Use `sequelize.sync({ alter: true })` for development (auto-updates schema)
- Testing: Run `npm test` in server or client directory

