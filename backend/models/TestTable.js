const mongoose = require('mongoose');

const TestTableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('TestTable', TestTableSchema);
