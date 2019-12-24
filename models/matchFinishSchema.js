const mongoose = require('mongoose');
const MATCH_FINISH_COLLECTION = "match_finish";

const schema = new mongoose.Schema({
    declarer: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
    filler: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
    message_id: Number,
    created_date: Date,
});

module.exports.schema = mongoose.model(MATCH_FINISH_COLLECTION, schema);
module.exports.name = MATCH_FINISH_COLLECTION;