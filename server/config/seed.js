/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

import User from '../api/users/user.model';
import Record from '../api/records/record.model';
import Event from '../api/events/event.model';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default function() {
Record.find({}).deleteMany({})
 .then(() => {
   Record.create(require('../../data/cuberecords.json'))
   .then(() => {
     console.log('finished loading records');
   })
 });

Event.find({}).deleteMany({})
  .then(() => {
    Event.create(require('../../data/cubecompetitions.json'))
    .then(() => {
      console.log('finished loading events');
    })
  });

  User.find({}).deleteMany({})
    .then(() => {
      User.create({
        provider: 'local',
        role: 'user',
        name: 'Test User',
        email: 'test@m.cubingza.org',
        password: 'test',
        notificationSettings: {
          GT: true,
          MP: false,
          LM: false,
          NW: false,
          FS: false,
          KZ: false,
          EC: false,
          WC: false,
          NC: false
        }
      }, {
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@m.cubingza.org',
        password: 'admin'
      }, {
        provider: 'local',
        name: 'Unver',
        email: 'unver@m.cubingza.org',
        password: 'unver',
        verificationToken: '123abc',
        notificationSettings: {
          GT: true,
          MP: false,
          LM: false,
          NW: false,
          FS: false,
          KZ: false,
          EC: false,
          WC: false,
          NC: false
        }
      })
      .then(() => {
        console.log('finished populating users');
      });
    });
}
