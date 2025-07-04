const express = require('express');
const router = express.Router();
const {
  createUserRole,
} = require('../controllers/userRole.api');

// Routes for Role CRUD operations
router.post('/', createUserRole);

module.exports = router;
