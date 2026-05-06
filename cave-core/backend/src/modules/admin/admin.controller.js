const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');
const Office = require('../offices/office.model');
const User = require('../users/user.model');
const { ApiError } = require('../../shared/errorHandler');

/**
 * @desc    Bulk Import Offices from CSV
 * @route   POST /api/admin/import/offices
 */
const importOffices = async (req, res, next) => {
  if (!req.file) return next(new ApiError(400, 'Please upload a CSV file'));

  const results = [];
  const errors = [];
  let processedCount = 0;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
          try {
            const { name, tier, parentName } = row;
            
            let parentId = null;
            let ancestors = [];

            if (parentName && parentName.trim() !== '') {
              const parentOffice = await Office.findOne({ name: parentName.trim() });
              if (parentOffice) {
                parentId = parentOffice._id;
                ancestors = [...parentOffice.ancestors, parentOffice._id];
              }
            }

            // Avoid duplicates
            const existing = await Office.findOne({ name: name.trim() });
            if (!existing) {
              await Office.create({
                name: name.trim(),
                tier: tier.trim(),
                parent: parentId,
                ancestors
              });
              processedCount++;
            }
          } catch (err) {
            errors.push({ row, error: err.message });
          }
        }
        
        fs.unlinkSync(req.file.path); // Clean up
        res.json({ success: true, message: `Successfully imported ${processedCount} offices`, errors });
      } catch (err) {
        next(err);
      }
    });
};

/**
 * @desc    Bulk Import Users from CSV
 * @route   POST /api/admin/import/users
 */
const importUsers = async (req, res, next) => {
  if (!req.file) return next(new ApiError(400, 'Please upload a CSV file'));

  const results = [];
  const errors = [];
  let processedCount = 0;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const salt = await bcrypt.genSalt(12);

        for (const row of results) {
          try {
            const { email, password, role, empCode, designation, mobile, primaryOfficeName } = row;
            
            // Check if user exists
            const existing = await User.findOne({ email: email.trim() });
            if (existing) {
              errors.push({ row, error: 'User already exists' });
              continue;
            }

            let officeId = null;
            if (primaryOfficeName) {
              const office = await Office.findOne({ name: primaryOfficeName.trim() });
              if (office) officeId = office._id;
            }

            const passwordHash = await bcrypt.hash(password.trim() || 'Welcome@123', salt);

            await User.create({
              email: email.trim(),
              passwordHash,
              role: role.trim() || 'Viewer',
              empCode: empCode?.trim(),
              designation: designation?.trim(),
              mobile: mobile?.trim(),
              primaryBase: officeId
            });
            
            processedCount++;
          } catch (err) {
            errors.push({ row, error: err.message });
          }
        }
        
        fs.unlinkSync(req.file.path);
        res.json({ success: true, message: `Successfully imported ${processedCount} users`, errors });
      } catch (err) {
        next(err);
      }
    });
};

module.exports = { importOffices, importUsers };
