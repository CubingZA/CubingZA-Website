'use strict';

import mongoose from 'mongoose';

var EventSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  venue: String,
  address: String,
  city: String,
  province: String,
  registrationName: String,
  notificationsSent: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Event', EventSchema);
