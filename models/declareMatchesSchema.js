const mongoose = require('mongoose');
const DECLARE_MATCHES_COLLECTION = "declare_matches";

const schema = new mongoose.Schema({
    declare: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
    opponent: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
    created_date: Date
});

module.exports.schema = mongoose.model(DECLARE_MATCHES_COLLECTION, schema);
module.exports.name = DECLARE_MATCHES_COLLECTION;