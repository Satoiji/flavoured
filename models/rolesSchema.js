const mongoose = require('mongoose');
const ROLES_COLLECTION = "roles";

const schema = new mongoose.Schema({
  name: String,
  priviledge: Number
});

module.exports.schema = mongoose.model(ROLES_COLLECTION, schema);