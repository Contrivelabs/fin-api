const mongoose = require('mongoose');
const { validateCustomer } = require('../validations/customers.validation');
const Customer = require('../models/customers');
const User = require('../models/users');
const Loan = require('../models/loans');
// Create a customer
exports.createCustomer = async (req, res, next) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  //Find the primaryPhoneNo in the users if it exists get the userId and assign it to the customer if not create a new user in the users collection
  const { primaryPhoneNo, companyId } = req.body;
  //Check uniqueness of primaryPhoneNo within the company
  const existingCustomer = await Customer.findOne({ primaryPhoneNo, companyId });
  if (existingCustomer) {
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
    const customer = new Customer(userObject);
    const savedCustomer = await customer.save();
    return res.status(201).json({ message: 'Customer created successfully', data: savedCustomer });
  } catch (err) {
    next(err);
  }
}

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find({companyId:req.body['companyId']});
    return res.status(200).json({ message: 'success', data: customers });
  } catch (err) {
    next(err);
  }
}

exports.updateCustomer = async (req, res, next) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const customerId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: 'Invalid customer ID' });
    }
    //check if the primaryPhoneNo is already used by another customer in the same company
    const { primaryPhoneNo, companyId } = req.body;
    const existingCustomer = await Customer.findOne({ primaryPhoneNo, companyId, _id: { $ne: customerId } });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Primary phone number already exists for this company.' });
    }
    if (req.body.primaryPhoneNo) {
      // Check if the primaryPhoneNo exists in the users collection
      const existingUser = await User.findOne({ primaryPhoneNo: req.body.primaryPhoneNo });
      if (existingUser) {
        // If it exists, update the userId in the customer object
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


    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, req.body, { new: true, runValidators: true });
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    return res.status(200).json({ message: 'Customer updated successfully', data: updatedCustomer });
  } catch (err) {
    next(err);
  }
}

exports.deleteCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: 'Invalid customer ID' });
    }

    //check if the customer has any loans
    const customerLoans = await Loan.find({ customerId: customerId });
    if (customerLoans.length > 0) {
      return res.status(400).json({ message: 'Cannot delete customer with existing loans' });
    }

    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    return res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    next(err);
  }
}
