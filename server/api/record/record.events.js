/**
 * Record model events
 */

'use strict';

import {EventEmitter} from 'events';
import Record from './record.model';
var RecordEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
RecordEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Record.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    RecordEvents.emit(event + ':' + doc._id, doc);
    RecordEvents.emit(event, doc);
  };
}

export default RecordEvents;
