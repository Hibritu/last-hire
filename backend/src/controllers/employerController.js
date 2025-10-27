const { EmployerProfile } = require('../models');

exports.getMe = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ where: { user_id: req.user.id } });
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch employer profile' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    const { type, company_name, sector, address, phone, website, category, tin_number  } = req.body;
    // If multer attached on route, optional uploaded file will be available here
    const uploadedLicensePath = req.file ? req.file.path : null;
    
    // Normalize empty strings -> null
    const nullIfEmpty = (v) => {
      if (v == null) return null;
      if (typeof v !== 'string') return v;
      const t = v.trim();
      // Treat empty and Swagger default placeholder "string" as null
      if (t === '' || t.toLowerCase() === 'string') return null;
      return v;
    };

    // Validate type first
    if (!['individual', 'company'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Must be individual or company' });
    }

    // Build a sanitized payload
    const updateData = {
      type,
      company_name: nullIfEmpty(company_name),
      sector: nullIfEmpty(sector),
      address: nullIfEmpty(address),
      phone: nullIfEmpty(phone),
      website: nullIfEmpty(website),
      category: nullIfEmpty(category),
      tin_number: nullIfEmpty(tin_number),
    };

    // Required check helper (treats null/undefined as missing)
    const requireFields = (fields) => {
      const missing = fields.filter(f => updateData[f] == null);
      if (missing.length) {
        res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
        return false;
      }
      return true;
    };

    // Per-type requirements
    if (type === 'company') {
      if (!requireFields(['company_name', 'sector', 'address', 'phone', 'category'])) return;

      // Ensure license_document exists, allow providing it in this request
      if (!profile.license_document && !uploadedLicensePath) {
        return res.status(400).json({ error: 'license_document is required for company. Upload a PDF via this request (field: license_document) or previously.' });
      }
    } else if (type === 'individual') {
      if (!requireFields(['address', 'phone', 'tin_number', 'category'])) return;
    }
    
    // Keep file if uploaded
    if (uploadedLicensePath) {
      updateData.license_document = uploadedLicensePath;
    }
    await profile.update(updateData);
    return res.json({
      profile,
      message: 'Profile updated successfully. Confirm payment 100 ETB  before posting a premium job.'
    });

  } catch (err) {
    if (err?.name && err.name.startsWith('Sequelize')) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Failed to update employer profile' });
  }
};



exports.getStatus = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    return res.json({ verification_status: profile.verification_status });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get status' });
  }
};
