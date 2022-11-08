'use strict';

import Event from '../../api/event/event.model';
import User from '../../api/user/user.model';
import Mailgun from 'mailgun-js';

function getProvinceCode(province) {
  let provinceNames = {
      GT:'Gauteng',
      MP:'Mpumalanga',
      LM:'Limpopo',
      NW:'North West',
      FS:'Free State',
      KZ:'KwaZulu Natal',
      EC:'Eastern Cape',
      WC:'Western Cape',
      NC:'Northern Cape'
    };
  
  for (let p in provinceNames) {
    if (provinceNames[p] === province) {
      return p;
    }
  }
  return null;
}

export default function sendNotificationEmails(comp) {
  
  console.log('\n\n======================\nSend Notifications\n======================\n\n');
  
  let province = getProvinceCode(comp.province);
    
  let mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  })
  
  User.find({}, '-salt -password').exec()
  .then(users => {
    console.log('Loaded users\n\n');
    
    for (let u in users) {
      let user = users[u];
        if (user.notificationSettings[province]) {
          // User has notification settings turned on for this province
          console.log('Sending email for',user.name, user.email);
                    
          let message = {
            from: 'CubingZA Notifications <compnotifications@m.cubingza.org>',
            to: `@${user.name} <${user.email}>`,
            subject: `New Cubing Competion Announcement: ${comp.name}`,
            text: `Hello ${user.name}\n\nThe ${comp.name} cubing competition has been announced. Visit http://cubingza.org for more details, or https://www.worldcubeassociation.org/competitions/${comp.registrationName}/register to register.\n\nRegards,\nCubingZA Team`
          };

          mailgun.messages().send(message, (err, body) => {
            if (err) {
              console.log('error');
              let datestamp = new Date().toISOString();
              User.updateOne({_id: user._id}, {$push: {eventLog: `${datestamp}Error sending message: ${message.to}, ${message.subject}`}});
            }
            else {
              console.log('success');
              let datestamp = new Date().toISOString();
              User.updateOne({_id: user._id}, {$push: {eventLog: `${datestamp}Message successfully sent: ${message.to}, ${message.subject}`}});
            }
          });
          
          
          //==============
          
        }
    }
  });
};
