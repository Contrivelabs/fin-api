const errorHandler = (err, req, res, next) => {
	console.error(err);

	// Invalid ObjectId Error
	if (err.name === 'CastError' && err.kind === 'ObjectId') {
		return res.status(400).json({
			message: 'Validation error',
			errors: [`Invalid ObjectId: '${err.value}' for field '${err.path}'`],
		});
	}

	// Mongoose Validation Error
	if (err.name === 'ValidationError') {
		const messages = Object.values(err.errors).map((val) => val.message);
		return res.status(400).json({
			message: 'Validation error',
			errors: messages,
		});
	}

	// Mongoose Duplicate Key Error
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0];
		const value = Object.values(err.keyValue)[0];
		return res.status(400).json({
			message: `${value} already exists`,
			errors: `Duplicate value for field '${field}': '${value}'`,
		});
	}

	if (err.status === 404) {
		return res
			.status(404)
			.json({ message: err.message || 'Resource not found' });
	}

	return res
		.status(500)
		.json({ message: err.message || 'Internal Server Error' });
};

module.exports = errorHandler;
