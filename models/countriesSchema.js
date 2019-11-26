const mongoose = require('mongoose');
const COUNTRIES_COLLECTION = "countries";

const schema = new mongoose.Schema({
  name: String,
  code: String
});

module.exports.schema = mongoose.model(COUNTRIES_COLLECTION, schema);
module.exports.name = COUNTRIES_COLLECTION;