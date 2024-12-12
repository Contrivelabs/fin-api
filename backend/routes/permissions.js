const express = require('express');
const {
	createPermission,
	getPermissions,
	getPermissionById,
	updatePermission,
	deletePermission,
} = require('../controllers/permissions.api');

const router = express.Router();

router.post('/', createPermission); // Create Permission
router.get('/', getPermissions); // Get All Permissions
router.get('/:id', getPermissionById); // Get Permission by ID
router.put('/:id', updatePermission); // Update Permission
router.delete('/:id', deletePermission); // Delete Permission

module.exports = router;
