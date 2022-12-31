import formData from 'form-data';
import Mailgun from 'mailgun.js';
import mailgunConfig from './mailgunConfig'

export function send(req, res) {  
  const mailgun = new Mailgun(formData);
  const mgClient = mailgun.client(mailgunConfig.getOptions());

  let message = {
    from: `${req.body.name} <${req.body.email}>`,
    to: `info@${process.env.MAILGUN_DOMAIN}`,
    subject: req.body.subject,
    text: req.body.message || 'No message'
  };

  return mgClient.messages.create(process.env.MAILGUN_DOMAIN, message)
    .then((data) => {
        res.status(200).json({
        success: true,
        message: 'Message successfully sent'
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: 'Error sending message'
      });
    })
}
