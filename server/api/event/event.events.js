/**
 * Event model events
 */

'use strict';

import {EventEmitter} from 'events';
import Event from './event.model';
var EventEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
EventEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Event.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    EventEvents.emit(event + ':' + doc._id, doc);
    EventEvents.emit(event, doc);
  };
}

export default EventEvents;
