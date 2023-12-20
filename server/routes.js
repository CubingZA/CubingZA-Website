import contact from './api/contact/index.js';
import records from './api/records/index.js';
import rankings from './api/rankings/index.js';
import events from './api/events/index.js';
import emails from './api/emails/index.js';
import users from './api/users/index.js';
import auth from './auth/index.js';

export default function routes(app) {
  app.use('/api/contact', contact);
  app.use('/api/records', records);
  app.use('/api/rankings', rankings);
  app.use('/api/events', events);
  app.use('/api/emails', emails);
  app.use('/api/users', users);
  app.use('/auth', auth);
}