import User from '../../api/users/user.model';
import * as emailService from '../../services/email/email.service';

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
