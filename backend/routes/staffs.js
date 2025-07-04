const express = require('express');
const router = express.Router();
const {
  createStaff,
  getStaffs,
  updateStaff,
  deleteStaff
} = require('../controllers/staffs.api');

// Routes
router.post('/', createStaff);
router.post('/by-company', getStaffs);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

module.exports = router;
