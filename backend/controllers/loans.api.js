const mongoose = require('mongoose');
const Loan = require('../models/loans');
const {loanValidation} = require('../validations/loans.validation');
const {generateLoanID} = require('../utils/loanIdGenerator');

const createLoan = async (req, res, next) => {
  const { error } = loanValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body['companyId'])) {
			return res.status(400).json({
				message: 'Validation error',
				errors: [
					`Invalid ObjectId: '${req.body['companyId']}' for field 'companyId'`,
				],
			});
		}

    if (!mongoose.Types.ObjectId.isValid(req.body['loanIssuedBy'])) {
			return res.status(400).json({
				message: 'Validation error',
				errors: [
					`Invalid ObjectId: '${req.body['loanIssuedBy']}' for field 'loanIssuedBy'`,
				],
			});
		}
    if (req.body['collectorId'] && !mongoose.Types.ObjectId.isValid(req.body['collectorId'])) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: [
          `Invalid ObjectId: '${req.body['collectorId']}' for field 'collectorId'`,
        ],
      });

    }
    // Generate a unique loan ID
    const loanTypeCode = req.body['loanType'] === 'personal' ? 'P' :
                          req.body['loanType'] === 'vehicle' ? 'V' : 'O';
    const loanId = await generateLoanID(loanTypeCode);
    console.log('Generated Loan ID:', loanId);
    req.body['loanId'] = loanId;
    const loan = new Loan(req.body);
    const savedLoan = await loan.save();
    res.status(201).json({ message: 'Loan created successfully', data: savedLoan });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
	try {
		const user = new User(req.body);
		const savedUser = await user.save();
		return res
			.status(201)
			.json({ message: 'User created successfully', data: savedUser });
	} catch (err) {
		next(err);
	}
};

const getLoans = async (req, res, next) => {
  try {
    const loans = await Loan.find();
    res.status(200).json(loans);
  } catch (err) {
    next(err);
  }
};

const getLoanById = async (req, res, next) => {
  try {
    //const loan = await Loan.findById(req.params.id);
    const loan = await Loan.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customerInfo'
        } 
      },
      {
        $lookup: {
          from: 'users',
          localField: 'loanIssuedBy',
          foreignField: '_id',
          as: 'loanIssuerInfo'
        }
      },
      {
        $lookup: {
          from: 'staffs',
          localField: 'collectorId',
          foreignField: '_id',
          as: 'collectorInfo'
        }
      },
      {
        $addFields: {
          customerName: { $arrayElemAt: ['$customerInfo.name', 0] },
          loanIssuedByName: { $arrayElemAt: ['$loanIssuerInfo.name', 0] },
          collectorIdName: { $arrayElemAt: ['$collectorInfo.name', 0] },
          customerPrimaryPhoneNo: { $arrayElemAt: ['$customerInfo.primaryPhoneNo', 0] },
        }
      },
      {
        $project: {
          loanId: 1,
          customerId: 1,
          customerName: 1,
          customerPrimaryPhoneNo: 1,
          customLoanId: 1, 
          loanType: 1,
          loanAmount: 1,
          paymentFrequency: 1,
          numOfDues: 1,
          interestRate: 1,
          deduction: 1,
          amountIssued: 1,
          amountIssuedDate: 1,
          dueAmount: 1,
          firstDueDate: 1,
          lastDueDate: 1,
          loanIssuedBy: 1,
          loanIssuedByName: 1,
          collectorId: 1,
          collectorIdName: 1,
          paymentMethod: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.status(201).json({ message: 'Loan fetched successfully.', data: loan });
  } catch (err) {
    next(err);
  }
};

const updateLoan = async (req, res, next) => {
  try {
    const { error } = loanValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.status(200).json({ message: 'Loan updated successfully', data: loan });
  } catch (err) {
    next(err);
  }
};

const deleteLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.status(200).json({ message: 'Loan deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const getLoansByCompanyAndBranch = async (req, res, next) => {
  try {
    const companyId = new mongoose.Types.ObjectId(req.body.companyId);
    const branchId = new mongoose.Types.ObjectId(req.body.branchId);

    const loans = await Loan.aggregate([
      {
        $match: {
          companyId: companyId,
          branchId: branchId,
          activeStatus: true
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customerInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'loanIssuedBy',
          foreignField: '_id',
          as: 'loanIssuerInfo'
        }
      },
      {
        $lookup: {
          from: 'staffs',
          localField: 'collectorId',
          foreignField: '_id',
          as: 'collectorInfo'
        }
      },
      {
        $addFields: {
          customerName: { $arrayElemAt: ['$customerInfo.name', 0] },
          loanIssuedByName: { $arrayElemAt: ['$loanIssuerInfo.name', 0] },
          collectorIdName: { $arrayElemAt: ['$collectorInfo.name', 0] }
        }
      },
      {
        $project: {
          loanId: 1,
          customerId: 1,
          customerName: 1,
          customLoanId: 1,
          loanType: 1,
          loanAmount: 1,
          paymentFrequency: 1,
          numOfDues: 1,
          interestRate: 1,
          deduction: 1,
          amountIssued: 1,
          amountIssuedDate: 1,
          dueAmount: 1,
          firstDueDate: 1,
          lastDueDate: 1,
          loanIssuedBy: 1,
          loanIssuedByName: 1,
          collectorId: 1,
          collectorIdName: 1,
          paymentMethod: 1
        }
      }
    ]);

    return res.status(200).json({ message: 'success', data: loans });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createLoan,
  getLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
  getLoansByCompanyAndBranch
};