'use strict';

import mongoose from 'mongoose';

var RecordSchema = new mongoose.Schema({
  eventName: String,
  eventId: String,
  eventRank: Number,

  singleResult: String,
  singleName: [String],
  singleId: [String],
  singleDate: [Date],

  averageResult: String,
  averageName: [String],
  averageId: [String],
  averageDate: [Date],
});

export default mongoose.model('Record', RecordSchema);
