require('dotenv').config();
const mongoose = require('mongoose');

main().catch((err) => console.log(err));

async function main() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('Connected to Database');
	} catch (err) {
		console.log(err);
	}
}

module.exports = main;
