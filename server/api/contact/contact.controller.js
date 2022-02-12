'use strict';

import Mailgun from 'mailgun-js';
import mailgunConfig from './mailgunConfig'

export function send(req, res) {  
  let mailgun = new Mailgun(mailgunConfig.getOptions());

  let message = {
    from: `${req.body.name} <${req.body.email}>`,
    to: `info@${process.env.MAILGUN_DOMAIN}`,
    subject: req.body.subject,
    text: req.body.message || 'No message'
  };

  mailgun.messages().send(message, (err, body) => {
    if (err) {
      res.status(500).json({
        success: false,
        error: 'Error sending message'
      });
    }
    else {
      res.status(200).json({
        success: true,
        message: 'Message successfully sent'
      });
    }
  });
}
