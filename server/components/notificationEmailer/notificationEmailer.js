import User from '../../api/users/user.model';
import * as emailService from '../../services/email/email.service';
import getProvinceCode from '../../api/provinces/province.service';


export default function sendNotificationEmails(comp) {

  let province = getProvinceCode(comp.province);

  return User.find({}, '-salt -password').exec()
  .then(users => {

    let sendRequests = [];

    for (let u in users) {
      let user = users[u];
      if (user.notificationSettings[province] && user.role !== 'unverified') {
        // User has notification settings turned on for this province

        let message = {
          from: 'CubingZA Notifications <compnotifications@m.cubingza.org>',
          to: `${user.name} <${user.email}>`,
          subject: `New Cubing Competition Announcement: ${comp.name}`,
          text: `Hello ${user.name}\n\nThe ${comp.name} cubing competition has been announced. Visit http://cubingza.org for more details, or https://www.worldcubeassociation.org/competitions/${comp.registrationName}/register to register.\n\nRegards,\nCubingZA Team`
        };

        sendRequests.push(emailService.send(message));
      }
    }
    return Promise.all(sendRequests);
  });
};
