const mongoose = require('mongoose');

const lookupSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  total: { type: Number, default: 0 } 
});

module.exports = mongoose.model('Lookup', lookupSchema);