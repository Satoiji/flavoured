const mongoose = require('mongoose');
const MATCH_FINISH_COLLECTION = "match_finish";

const schema = new mongoose.Schema({
    writer: String,
    reacter: String,
    winner: String,
    losser: String,
    message_id: String,
    match_date: String,
    score: String
});

module.exports.schema = mongoose.model(MATCH_FINISH_COLLECTION, schema);
module.exports.name = MATCH_FINISH_COLLECTION;