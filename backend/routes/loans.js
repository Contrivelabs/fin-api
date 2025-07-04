const express = require('express');
const {
  createLoan,
  getLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
  getLoansByCompanyAndBranch
} = require('../controllers/loans.api');

const router = express.Router();

router.post('/', createLoan);
router.get('/', getLoans);
router.get('/:id', getLoanById);
router.put('/:id', updateLoan);
router.delete('/:id', deleteLoan);
router.post('/by-company-branch', getLoansByCompanyAndBranch);

module.exports = router;