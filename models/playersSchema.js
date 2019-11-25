const mongoose = require('mongoose');
const PLAYERS_COLLECTION = "players";

const schema = new mongoose.Schema({
  discord_id: String,
  name: String,
  tag: String,
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'countries' },
  platform: { type: mongoose.Schema.Types.ObjectId, ref: 'platforms' },
  created: Date,
  games_played: Number,
  elo1_temp: Number,
  elo2_temp: Number,
  last_game_date: Date
});

module.exports.schema = mongoose.model(PLAYERS_COLLECTION, schema);