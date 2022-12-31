import express from 'express';
import mongoose from 'mongoose';
import Bluebird from 'bluebird';

import config from './config/environment'
import configExpress from './config/express';
import seedDB from './config/seed'
import routes from './routes';

// Connect to MongoDB
mongoose.Promise = Bluebird;
mongoose.set('strictQuery', true);
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// Populate databases with sample data
if(config.seedDB) {
  seedDB();
}

const app = express();
configExpress(app);
routes(app);

setImmediate(()=>{
  app.listen(config.port, ()=>{
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
});
