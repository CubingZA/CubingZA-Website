import User from '../../api/users/user.model.js';
import * as emailService from '../../services/email/email.service.js';
import getProvinceCode from '../../api/provinces/province.service.js';
import fs from 'fs';

export default function sendNotificationEmails(comp) {

  let province = getProvinceCode(comp.province);

  return User.find({}, '-salt -password').exec()
  .then(users => {

    let sendRequests = [];

    for (let u in users) {
      let user = users[u];
      if (user.notificationSettings[province] && user.role !== 'unverified') {
        // User has notification settings turned on for this province

        fs.readFile('/Users/elfis/Documents/code/CubingZA-Website/server/components/notificationEmailer/notification.template.html', 'utf8', (err, data) => {
          if (err) {
            console.error("Failed to read email template:", err);
            return;
          }

          let notificationemailertemplate = data.replace('{{user.name}}', user.name)
                         .replace('{{comp.name}}', comp.name)
                         .replace('{{comp.registrationName}}', comp.registrationName);

          let message = {
            from: 'CubingZA Notifications <compnotifications@m.cubingza.org>',
            to: `${user.name} <${user.email}>`,
            subject: `New Cubing Competition Announcement: ${comp.name}`,
            html: notificationemailertemplate
          };

          sendRequests.push(emailService.send(message));
        });
      }
    }
    return Promise.all(sendRequests);
  });
};
