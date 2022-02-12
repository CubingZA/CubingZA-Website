'use strict';

function getOptions() {
  return {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  }
};

export default { getOptions };
