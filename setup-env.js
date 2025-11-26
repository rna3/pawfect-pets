#!/usr/bin/env node

/**
 * Simple script to help set up the .env file
 * Run: node setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnv() {
  console.log('🐾 Pawfect Pets - Environment Setup\n');
  console.log('This script will help you create the .env file for the server.\n');

  const envPath = path.join(__dirname, 'server', '.env');
  const examplePath = path.join(__dirname, 'server', 'env.example');

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env file already exists. Overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  // Read example file
  if (!fs.existsSync(examplePath)) {
    console.error('Error: env.example file not found!');
    rl.close();
    process.exit(1);
  }

  const exampleContent = fs.readFileSync(examplePath, 'utf8');

  // Get user input
  console.log('\nPlease enter the following information:');
  console.log('(Press Enter to use default values)\n');

  const dbPassword = await question('PostgreSQL Password [your_password]: ') || 'your_password';
  const jwtSecret = await question('JWT Secret [my_super_secret_jwt_key_12345]: ') || 'my_super_secret_jwt_key_12345';
  const dbHost = await question('Database Host [localhost]: ') || 'localhost';
  const dbPort = await question('Database Port [5432]: ') || '5432';
  const dbName = await question('Database Name [pawfect_pets]: ') || 'pawfect_pets';
  const dbUser = await question('Database User [postgres]: ') || 'postgres';

  // Replace values in example content
  let envContent = exampleContent
    .replace('DB_PASSWORD=your_password', `DB_PASSWORD=${dbPassword}`)
    .replace('DB_HOST=localhost', `DB_HOST=${dbHost}`)
    .replace('DB_PORT=5432', `DB_PORT=${dbPort}`)
    .replace('DB_NAME=pawfect_pets', `DB_NAME=${dbName}`)
    .replace('DB_USER=postgres', `DB_USER=${dbUser}`)
    .replace('JWT_SECRET=your_super_secret_jwt_key_change_in_production', `JWT_SECRET=${jwtSecret}`);

  // Write .env file
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ .env file created successfully!');
  console.log(`📁 Location: ${envPath}\n`);
  console.log('Next steps:');
  console.log('1. Verify your PostgreSQL database is running');
  console.log('2. Create the database: createdb -U postgres pawfect_pets');
  console.log('3. Run: cd server && npm run db:seed');
  console.log('4. Run: npm run dev (from root directory)\n');

  rl.close();
}

setupEnv().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});

