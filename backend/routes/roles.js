const express = require('express');
const router = express.Router();
const {
	createRole,
	getRoles,
	getRoleById,
	updateRole,
	deleteRole,
	updateRolePermissions,
} = require('../controllers/roles.api');

// Routes for Role CRUD operations
router.post('/', createRole);
router.get('/', getRoles);
router.get('/:id', getRoleById);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);
router.put('/:id/permissions', updateRolePermissions);

module.exports = router;
