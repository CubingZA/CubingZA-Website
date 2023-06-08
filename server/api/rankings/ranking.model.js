'use strict';

import mongoose from 'mongoose';

var RankingSchema = new mongoose.Schema({
  wcaID: String,
  eventId: String,
  countryRank: Number,
  best: String,
  userId: String,
  personName: String,
  province: String,
  provinceRank: Number,
});


export default {
  Single: mongoose.model('SingleRanking', RankingSchema),
  Average: mongoose.model('AverageRanking', RankingSchema),
};
