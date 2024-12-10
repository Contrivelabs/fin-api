const express = require('express');
const {
	createBranch,
	getAllBranches,
	getBranchById,
	updateBranch,
	deleteBranch,
} = require('../controllers/branches.api');

const router = express.Router();

// Routes
router.post('/', createBranch);
router.get('/', getAllBranches);
router.get('/:id', getBranchById);
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);

module.exports = router;
