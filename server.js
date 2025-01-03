const express = require('express');
const path = require('path');
const apiRoutes = require('./backend/routes/api');
const connection = require('./backend/config/db');
const errorHandler = require('./backend/middlewares/errorHandler');
const port = process.env.PORT || 4000;
const app = express();
const cors = require('cors');
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
app.use(limiter);

const companiesRoutes = require('./backend/routes/companies');
const branchesRoutes = require('./backend/routes/branches');
const usersRoutes = require('./backend/routes/users');
const permissionsRoutes = require('./backend/routes/permissions');

app.use('/api/companies', companiesRoutes);
app.use('/api/branches', branchesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/permissions', permissionsRoutes);

app.get('/', (req, res) => {
	res.send('FIN-API backend Running');
});

// Catch 404
app.use((req, res, next) => {
	const error = new Error('Resource not found');
	error.status = 404;
	next(error);
});

// Centralized error handler
app.use(errorHandler);
app.listen(port, () => {
	console.log(`Fin_App server running on ${port}`);
});
