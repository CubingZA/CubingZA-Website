import shared from './shared.config';
import * as dotenv from 'dotenv'

const nodeEnv = process.env['NODE_ENV'] = process.env['NODE_ENV'] || 'development';
const envconfig = (await import(`./${nodeEnv}.config.js`)).default;

// Load dev environment
switch (nodeEnv) {
  case 'development':
    dotenv.config({path: './config/local.env'});
    break;
  case 'test':
    dotenv.config({path: './config/test.env'});
    break;
  }

const all = {
  env: process.env.NODE_ENV,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: process.env.SESSION_SECRET || "Don't forget to set session secret"
  },

  // MongoDB connection options
  mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017",
  mongo: {
    options: {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  }
};

export default {
  ...all,
  ...shared,
  ...envconfig
}