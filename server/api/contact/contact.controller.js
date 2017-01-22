'use strict';

import jsonpatch from 'fast-json-patch';
import Mailgun from 'mailgun-js';


export function send(req, res) {  
  
  let mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  })

  let message = {
    from: `${req.body.name} <${req.body.email}>`,
    to: `info@${process.env.MAILGUN_DOMAIN}`,
    subject: req.body.subject,
    text: req.body.message || 'No message'
  }

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
