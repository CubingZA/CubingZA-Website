'use strict';

import mongoose from 'mongoose';

var RecordSchema = new mongoose.Schema({
  eventName: String,
  eventId: String,
  singleName: String,
  singleResult: String,
  singleId: String,
  singleDate: Date,
  averageName: String,
  averageResult: String,
  averageId: String,
  averageDate: Date,
  eventRank: Number
});

export default mongoose.model('Record', RecordSchema);
