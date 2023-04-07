import * as emailService from '../../services/email/email.service';

export function send(req, res) {  

  let message = {
    from: `${req.body.name} <${req.body.email}>`,
    to: `info@${process.env.MAILGUN_DOMAIN}`,
    subject: req.body.subject,
    text: req.body.message || 'No message'
  };

  return emailService.send(message)
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
