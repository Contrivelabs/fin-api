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

const companiesRoutes = require('./backend/routes/companies');
const branchesRoutes = require('./backend/routes/branches');
const usersRoutes = require('./backend/routes/users');

app.use('/api/companies', companiesRoutes);
app.use('/api/branches', branchesRoutes);
app.use('/api/users', usersRoutes);

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
