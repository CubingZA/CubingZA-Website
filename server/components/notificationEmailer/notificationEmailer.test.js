import {jest} from '@jest/globals';
import mockingoose from 'mockingoose';

// Mock Email service
jest.unstable_mockModule('../../services/email/email.service', function() {
  return {
    send: jest.fn().mockReturnValue(new Promise(resolve => {resolve({})})),
    validate: jest.fn().mockReturnValue(new Promise(resolve => {resolve({})})),
  }
});
const emailService = (await import('../../services/email/email.service'));

const User = (await import('../../api/users/user.model')).default;
const Event = (await import('../../api/events/event.model')).default;

const sendNotificationEmails = (await import('./notificationEmailer')).default;

const mockEvent = {
  name:"Test Competition",
  venue: "Test Venue",
  address: "Test Address",
  city: "Test City",
  province: "Gauteng",
  registrationName: "TestRegistrationName",
  notificationsSent: true
};

const mockUsers = [
  {
    name: "Test User",
    email: "test@example.com",
    role: "user",
    notificationSettings: {
      GT: false,
      MP: true,
      LM: true,
      NW: true,
      FS: true,
      KZ: true,
      EC: true,
      WC: true,
      NC: true
    },
  },
  {
    name: "Someone Else",
    email: "someone@else.com",
    role: "user",
    notificationSettings: {
      GT: true,
      MP: false,
      LM: false,
      NW: false,
      FS: false,
      KZ: false,
      EC: false,
      WC: false,
      NC: false
    },
  },
  {
    name: "Another User",
    email: "email@another.com",
    role: "unverified",
    notificationSettings: {
      GT: true,
      MP: false,
      LM: false,
      NW: false,
      FS: false,
      KZ: false,
      EC: false,
      WC: false,
      NC: false
    },
  }
];


describe ("Notification Emailer:", function() {

  beforeEach(async function() {
    jest.clearAllMocks();
    mockingoose.resetAll();
  });

  describe("Calling sendNotificationEmails", function () {

    it("should pass", async function() {

      mockingoose(User).toReturn(mockUsers, 'find');

      let comp = new Event(mockEvent);
      await sendNotificationEmails(comp)

      expect(emailService.send).toHaveBeenCalledTimes(1);
      expect(emailService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "CubingZA Notifications <compnotifications@m.cubingza.org>",
          to: "Someone Else <someone@else.com>"
        })
      );
      expect(emailService.send.mock.calls[0][0].subject)
      .toContain("New Cubing Competition Announcement: ");
      expect(emailService.send.mock.calls[0][0].subject)
      .toContain(comp.name);
      expect(emailService.send.mock.calls[0][0].text)
      .toContain("Someone Else");
      expect(emailService.send.mock.calls[0][0].text)
      .toContain("https://www.worldcubeassociation.org/competitions/TestRegistrationName/register");
    });

  });
});
