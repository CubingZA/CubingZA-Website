import contact from './api/contact'
import records from './api/records'
import events from './api/events'
import users from './api/users'
import auth from './auth'

export default function routes(app) {
  app.use('/api/contact', contact);
  app.use('/api/records', records);
  app.use('/api/events', events);
  app.use('/api/users', users);
  app.use('/auth', auth);
}