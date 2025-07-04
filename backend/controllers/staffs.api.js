const mongoose = require('mongoose');
const Staff = require('../models/staffs');
const { validateStaff } = require('../validations/staffs.validation');
const { ErrorResponse } = require('../middlewares/errorHandler');
const User = require('../models/users');
const Loan = require('../models/loans');
// Create a staff
exports.createStaff = async (req, res, next) => {
	const { error } = validateStaff(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	//Find the primaryPhoneNo in the users if it exists get the userId and assign it to the staff if not create a new user in the users collection
	const { primaryPhoneNo, companyId } = req.body;
	//Check uniqueness of primaryPhoneNo within the company
	const existingStaff = await Staff.findOne({ primaryPhoneNo, companyId });
	if (existingStaff) {
		return res.status(400).json({ message: 'Primary phone number already exists for this company.' });
	}
	let userId;
	try {
		const existingUser = await User.findOne({ primaryPhoneNo });
		if (existingUser) {
			userId = existingUser._id;
		}{
			// Create a new user if it doesn't exist
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				primaryPhoneNo:primaryPhoneNo,
				alternatePhoneNo: req.body.alternatePhoneNo,
				city: req.body.city,
			});
			const savedUser = await newUser.save();
			userId = savedUser._id;
		}
	} catch (err) {
		return res.status(500).json({ message: 'Error checking existing user', error: err.message });
	}

	try {
		var userObject = req.body;
		userObject['userId'] = userId;
		const staff = new Staff(userObject);
		const savedStaff = await staff.save();
		return res.status(201).json({ message: 'Staff created successfully', data: savedStaff });
	} catch (err) {
		next(err);
	}
}

exports.getStaffs = async (req, res, next) => {
	try {
		//const staffs = await Staff.find({companyId:req.body['companyId']});

		const companyId = new mongoose.Types.ObjectId(req.body['companyId']);

// ...existing code...
const staffs = await Staff.aggregate([
    {
        $match: {
            companyId: companyId,
            activeStatus: true
        }
    },
    {
        $lookup: {
            from: "roles",
            let: { staffCompanyId: "$companyId", staffRoleId: "$roleId" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$companyId", "$$staffCompanyId"] },
                                { $eq: ["$_id", "$$staffRoleId"] }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        name: 1
                    }
                }
            ],
            as: 'roleInfo'
        }
    },
    {
        $addFields: {
            roleName: { $arrayElemAt: ["$roleInfo.name", 0] }
        }
    },
    {
        $project: {
            name: 1,
            roleName: 1,
            _id: 1,
            userId: 1,
            roleId: 1,
            companyId: 1,
            branchId: 1,
            primaryPhoneNo: 1,
            alternatePhoneNo: 1,
            city: 1,
        }
    }
]);
// ...existing code...

				console.log('New Staff List:', staffs);
		return res.status(200).json({ message: 'success', data: staffs });
	} catch (err) {
		next(err);
	}
}

exports.updateStaff = async (req, res, next) => {
	const { error } = validateStaff(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	try {
		const staffId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(staffId)) {
			return res.status(400).json({ message: 'Invalid staff ID' });
		}
		//check if the primaryPhoneNo is already used by another staff in the same company
		const { primaryPhoneNo, companyId } = req.body;
		const existingStaff = await Staff.findOne({ primaryPhoneNo, companyId, _id: { $ne: staffId } });
		if (existingStaff) {
			return res.status(400).json({ message: 'Primary phone number already exists for this company.' });
		}
		if (req.body.primaryPhoneNo) {
			// Check if the primaryPhoneNo exists in the users collection
			const existingUser = await User.findOne({ primaryPhoneNo: req.body.primaryPhoneNo });
			if (existingUser) {
				// If it exists, update the userId in the staff object
				req.body.userId = existingUser._id;
			} else {
				// If it doesn't exist, create a new user
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					primaryPhoneNo: req.body.primaryPhoneNo,
					alternatePhoneNo: req.body.alternatePhoneNo,
					city: req.body.city,
				});
				const savedUser = await newUser.save();
				req.body.userId = savedUser._id;
			}
		} 


		const updatedStaff = await Staff.findByIdAndUpdate(staffId, req.body, { new: true, runValidators: true });
		if (!updatedStaff) {
			return res.status(404).json({ message: 'Staff not found' });
		}
		
		return res.status(200).json({ message: 'Staff updated successfully', data: updatedStaff });
	} catch (err) {
		next(err);
	}
}

exports.deleteStaff = async (req, res, next) => {
	try {
		const staffId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(staffId)) {
			return res.status(400).json({ message: 'Invalid staff ID' });
		}

		//check if the staff has any loans
		const staffCollectionLoans = await Loan.find({ collectorId: staffId });
		if (staffCollectionLoans.length > 0) {
			return res.status(400).json({ message: 'Cannot delete staff with existing loans' });
		}

		const deletedStaff = await Staff.findByIdAndDelete(staffId);
		if (!deletedStaff) {
			return res.status(404).json({ message: 'Staff not found' });
		}
		return res.status(200).json({ message: 'Staff deleted successfully' });
	} catch (err) {
		next(err);
	}
}