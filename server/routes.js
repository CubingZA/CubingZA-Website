import contact from './api/contact';
import records from './api/records';
import rankings from './api/rankings';
import events from './api/events';
import emails from './api/emails';
import users from './api/users';
import auth from './auth';

export default function routes(app) {
  app.use('/api/contact', contact);
  app.use('/api/records', records);
  app.use('/api/rankings', rankings);
  app.use('/api/events', events);
  app.use('/api/emails', emails);
  app.use('/api/users', users);
  app.use('/auth', auth);
}