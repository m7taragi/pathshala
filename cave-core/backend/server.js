require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const seedDatabase = require('./src/config/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDatabase();
  
  app.listen(PORT, () => {

    console.log(`\n  ⚡ CAVE-CORE Server running on port ${PORT}`);
    console.log(`  📡 API:    http://localhost:${PORT}/api`);
    console.log(`  💚 Health: http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
