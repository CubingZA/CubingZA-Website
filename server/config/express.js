import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import lusca from 'lusca';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import errorHandler from 'errorhandler';

import config from './environment';

export default function(app) {
  var env = app.get('env');

  app.use(morgan('dev'));

  app.set('views', `${config.root}/server/views`);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Persist sessions with MongoStore / sequelizeStore
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    cookie: {
      secure: false, // In production this should be overridden at at the nginx layer using, for example, "proxy_cookie_flags ~ secure;"
      sameSite: 'lax', // Needed for OAuth to work
    },
    store: MongoStore.create({
      mongoUrl: config.mongoUrl,
      db: 'cubingza'
    })
  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if(env !== 'test' && !process.env.SAUCE_USERNAME) {
    app.use(lusca({
      csrf: false, // Breaks the contact form on the mobile app
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true,
      nosniff: true,
      referrerPolicy: 'same-origin'
    }));
  }

  if(env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
}
