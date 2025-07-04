const express = require('express');
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customers.api');

// Routes
router.post('/', createCustomer);
router.post('/by-company', getCustomers);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
