'use strict';

// Use local.env.js for environment variables that will be set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: 'project-secret',
  
  // Mailgun parameters
  MAILGUN_DOMAIN: 'your-mailgun-domain',
  MAILGUN_API_KEY: 'your-mailgun-api',
  
  // WCA OAuth Details
  WCA_OAUTH_CLIENTID: 'your-wca-app-id',
  WCA_OAUTH_CLIENT_SECRET: 'your-wca-client-secret',
  WCA_OAUTH_CALLBACKURL: 'https://example.com/auth/wca/callback',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
