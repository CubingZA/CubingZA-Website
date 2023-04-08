import formData from 'form-data';
import Mailgun from 'mailgun.js';
import mailgunConfig from './mailgunConfig'

function getClient() {
  const mailgun = new Mailgun(formData);
  return mailgun.client(mailgunConfig.getOptions());
}

export function send(message) {
  return getClient().messages.create(process.env.MAILGUN_DOMAIN, message);
}

export function validate(email) {
  return getClient().validate.get(email);
}
