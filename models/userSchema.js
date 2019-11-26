const mongoose = require('mongoose');
const USERS_COLLECTION = "users";

const schema = new mongoose.Schema({
  discord_id: Number,
  tag: String,
  role: [{ type: mongoose.Schema.Types.ObjectId, ref: 'roles' }],
  created: Date
});

module.exports.schema = mongoose.model(USERS_COLLECTION, schema);
module.exports.name = USERS_COLLECTION;