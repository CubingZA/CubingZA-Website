import sanitize from 'mongo-sanitize';
import Event from './event.model';
import sendNotificationEmails from '../../components/notificationEmailer/notificationEmailer';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Events
export function index(req, res) {
  return Event.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of upcoming Events
export function upcoming(req, res) {
  let today = new Date();
//  let today = new Date(2016, 6, 1);
  return Event.find({endDate: {$gte: today}}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Event from the DB
export function show(req, res) {
  return Event.findById(sanitize(req.params.id)).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Event in the DB
export function create(req, res) {
  if (req.body._id !== undefined) {
    delete req.body._id;
  }
  return Event.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Event in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Event.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Event from the DB
export function destroy(req, res) {
  return Event.findById(sanitize(req.params.id)).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Send notifications for an event
export function sendNotifications(req, res) {
  return Event.findById(sanitize(req.params.id)).exec()
    .then(handleEntityNotFound(res))
    .then(comp => {
      sendNotificationEmails(comp);
      comp.notificationsSent = true;
      comp.save();
      return {message: 'success'};
    })
   .then(respondWithResult(res))
   .catch(handleError(res));
}