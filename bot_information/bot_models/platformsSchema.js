const mongoose = require('mongoose');
const PLATFORMS_COLLECTION = "platforms";

const schema = new mongoose.Schema({
  name: String,
  code: String
});

module.exports.schema = mongoose.model(PLATFORMS_COLLECTION, schema);
module.exports.name = PLATFORMS_COLLECTION;