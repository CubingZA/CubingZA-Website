import {jest} from '@jest/globals';

const messageCreate = jest.fn();
const validateGet = jest.fn();

// Mock Mailgun
jest.unstable_mockModule('mailgun.js', () => {
  return {
    default: function() {this.client = jest.fn().mockReturnValue({
      messages: {
        create: messageCreate
      },
      validate: {
        get: validateGet
      }
    });},
  }
});

const Mailgun = (await import('mailgun.js')).default;
const emailService = (await import('./email.service'));

describe("Email service:", function() {
  
  beforeEach(async function() {
    jest.clearAllMocks();
  });

  it("should send an email message when send is called", function() {
    const message = {
      name: "Sender",
      email: "sender@example.com",
      subject: "Subject",
      message: "Test Message"
    }
    emailService.send(message);
    expect(messageCreate).toHaveBeenCalledWith(
      process.env.MAILGUN_DOMAIN,
      message
    );
  });

  it("should validate an email address when validate is called", function() {
    const emailAddress = "test@example.com";
    emailService.validate(emailAddress);
    expect(validateGet).toHaveBeenCalledWith(
      emailAddress
    );
  });

});
