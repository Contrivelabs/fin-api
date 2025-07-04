const Joi = require('joi');

const loanValidation = (data)=> {
  const schema = Joi.object({
  loanType: Joi.string()
    .valid('personal', 'vehicle', 'other')
    .required()
    .messages({ 'any.required': 'Loan type is required' }),
  customerId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid customer ID',
      'any.required': 'Customer ID is required',
    }),
  loanAmount: Joi.number()
    .greater(0)
    .required()
    .messages({
      'number.base': 'Loan amount must be a number',
      'any.required': 'Loan amount is required',
      'number.greater': 'Loan amount must be greater than zero',
    }),
  
  paymentFrequency: Joi.string()
    .valid('daily', 'weekly', 'monthly')
    .required()
    .messages({ 'any.required': 'Payment frequency is required' }),
  
  numOfDues: Joi.number()
    .integer()
    .greater(0)
    .required()
    .messages({
      'number.base': 'Number of dues must be a number',
      'any.required': 'Number of dues is required',
      'number.greater': 'Number of dues must be at least 1',
    }),
  
  interestRate: Joi.number()
    .min(0)
    .messages({ 'number.min': 'Interest rate cannot be negative' }),
  
  deduction: Joi.number()
    .min(0)
    .messages({ 'number.min': 'Deduction cannot be negative' }),
  
  amountIssued: Joi.number()
    .greater(0)
    .required()
    .messages({
      'any.required': 'Amount issued is required',
      'number.greater': 'Amount issued must be greater than zero',
    }),
  
  amountIssuedDate: Joi.date()
    .required()
    .messages({ 'any.required': 'Amount issued date is required' }),
  
  dueAmount: Joi.number()
    .greater(0)
    .required()
    .messages({
      'any.required': 'Due amount is required',
      'number.greater': 'Due amount must be greater than zero',
    }),
  
  firstDueDate: Joi.date()
    .required()
    .messages({ 'any.required': 'First due date is required' }),
  
  lastDueDate: Joi.date()
    .required()
    .messages({ 'any.required': 'Last due date is required' }),
  
  loanIssuedBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid loan issuer ID',
      'any.required': 'Loan issuer is required',
    }),
  
  collectorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid collector ID',
      'any.required': 'Collector is required',
    }),
  
  paymentMethod: Joi.string().allow(null, '')
    .valid('cash', 'bank', 'online', ''),
  
  guarantorName: Joi.string().allow(null, '')
    .max(100)
    .messages({ 'string.max': 'Guarantor name cannot exceed 100 characters' }),
  
  guarantorPhoneNo: 
    Joi.string().allow(null, '')
          .pattern(/^[0-9]{10}$/)
          .required()
          .messages({
            'string.pattern.base':
              'Guarantor phone number must be a 10-digit number.'
          }),
  
  relationWithGuarantor: Joi.string().allow(null, '')
    .max(50)
    .messages({ 'string.max': 'Relationship with guarantor cannot exceed 50 characters' }),
  
    guarantorIDType: Joi.string().allow(null, '')
    .valid('Aadhar', 'PAN', 'Passport', 'VoterID', 'other'),
  
    guarantorUploadIDProof: Joi.string().allow(null, ''),
  
  guaranteeType: Joi.string().allow(null, '')
    .valid('personal', 'property', 'vehicle', 'other'),
  
  guaranteeDocumentType: Joi.string().allow(null, '')
    .valid('photo', 'scanned', 'online'),
  
  companyId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid company ID',
      'any.required': 'Company ID is required',
    }),
  
  branchId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null),
  
  activeStatus: Joi.boolean(),
});
return schema.validate(data, { abortEarly: false });
}

module.exports = {loanValidation};