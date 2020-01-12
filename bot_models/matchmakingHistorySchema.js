const mongoose = require('mongoose');
const MATCHMAKING_HISTORY_COLLECTION = "matchmaking_history";

const schema = new mongoose.Schema({
    challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
    challengee: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
    winner: {type: mongoose.Schema.Types.ObjectId, ref: 'players'},
    created_date: Date,
    game_date: Date,
    challenger_old_rating: Number,
    challenger_new_rating: Number,
    challengee_old_rating: Number,
    challengee_new_rating: Number,
    status: Number,
    video: String,
    level1_code: String,
    level2_code: String,
    level3_code: String
});

module.exports.schema = mongoose.model(MATCHMAKING_HISTORY_COLLECTION, schema);
module.exports.name = MATCHMAKING_HISTORY_COLLECTION;