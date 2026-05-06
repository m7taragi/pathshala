const bcrypt = require('bcryptjs');
const User = require('../modules/users/user.model');
const Office = require('../modules/offices/office.model');

/**
 * Seed the database with a default Head Office and an Admin user.
 */
const seedDatabase = async () => {
  try {
    // 1. Check if Head Office exists
    let headOffice = await Office.findOne({ tier: 'Head' });
    if (!headOffice) {
      console.log('[SEED] Creating default Head Office...');
      headOffice = await Office.create({
        name: 'Command Head Office',
        tier: 'Head',
        parent: null,
        ancestors: []
      });
      console.log(`[SEED] Head Office created: ${headOffice._id}`);
    }

    // 2. Check if Admin user exists
    const adminEmail = 'admin@cavecore.app';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      console.log('[SEED] Creating default Admin account...');
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash('Admin@123', salt);

      const adminUser = await User.create({
        email: adminEmail,
        passwordHash,
        role: 'Admin',
        primaryBase: headOffice._id
      });
      
      console.log(`[SEED] Admin account created: ${adminEmail} / Admin@123`);
    } else {
      console.log('[SEED] Admin account already exists.');
    }
  } catch (error) {
    console.error(`[SEED] Error seeding database: ${error.message}`);
  }
};

module.exports = seedDatabase;
