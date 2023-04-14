'use strict';

function getOptions() {
  return {
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
  }
};

export default { getOptions };
