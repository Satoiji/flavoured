const mongoose = require('mongoose');
const MATCHMAKING_COLLECTION = "matchmaking";

const schema = new mongoose.Schema({
    challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
    challengee: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
    created_date: Date,
    expiry_date: Date
});

module.exports.schema = mongoose.model(MATCHMAKING_COLLECTION, schema);
module.exports.name = MATCHMAKING_COLLECTION;