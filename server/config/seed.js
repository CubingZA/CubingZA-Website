/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

import User from '../api/users/user.model.js';
import Record from '../api/records/record.model.js';
import Event from '../api/events/event.model.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default function() {
Record.find({}).deleteMany({})
 .then(() => {
   Record.create(require('../seed-data/cuberecords.json'))
   .then(() => {
     console.log('finished loading records');
   })
 });

Event.find({}).deleteMany({})
  .then(() => {
    Event.create(require('../seed-data/cubecompetitions.json'))
    .then(() => {
      console.log('finished loading events');
    })
  });

User.find({}).deleteMany({})
  .then(() => {
    User.create(require('../seed-data/users.json'))
    .then(() => {
      console.log('finished populating users');
    });
  });
}
