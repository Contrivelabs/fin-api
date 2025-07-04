const express = require('express');
const {
	createBranch,
	getAllBranches,
	getBranchById,
	updateBranch,
	deleteBranch,
	getBranchesByCompanyId
} = require('../controllers/branches.api');

const router = express.Router();

// Routes
router.post('/', createBranch);
router.get('/', getAllBranches);
router.get('/:id', getBranchById);
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);
router.post('/by-company', getBranchesByCompanyId); // Get branches by company ID

module.exports = router;
