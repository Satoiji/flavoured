const mongoose = require('mongoose');
const DECLARE_MATCHES_COLLECTION = "declare_matches";

const schema = new mongoose.Schema({
    challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
    challengee: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
    created_date: Date
});

module.exports.schema = mongoose.model(DECLARE_MATCHES_COLLECTION, schema);
module.exports.name = DECLARE_MATCHES_COLLECTION;