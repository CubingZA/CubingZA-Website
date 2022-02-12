/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Record from '../api/record/record.model';
import Event from '../api/event/event.model';

Record.find({}).remove()
 .then(() => {
   Record.create(require('../../../cuberecords.json'))
   .then(() => {
     console.log('finished loading records');
   })
 });

Event.find({}).deleteMany({})
  .then(() => {
    Event.create(require('../../../cubecompetitions.json'))
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
      password: 'test'
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
      verificationToken: '123abc'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
