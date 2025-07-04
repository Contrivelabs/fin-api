const express = require('express'),
	router = express.Router();
const auth = require('../middlewares/auth');
const companiesRoutes = require('./companies');
const branchesRoutes = require('./branches');
const usersRoutes = require('./users');
const permissionsRoutes = require('./permissions');
const rolesRoutes = require('./roles');
const loanRoutes = require('./loans');
const customersRoutes = require('./customers');
const staffsRoutes = require('./staffs');

router.use('/companies',  companiesRoutes); //auth(),
router.use('/branches', branchesRoutes);
router.use('/users', usersRoutes);
router.use('/permissions', permissionsRoutes);
router.use('/roles', rolesRoutes);
router.use('/loans', loanRoutes);
router.use('/customers', customersRoutes);
router.use('/staffs', staffsRoutes);

module.exports = router;
