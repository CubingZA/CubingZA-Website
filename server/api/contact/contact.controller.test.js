import {jest} from '@jest/globals';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

// Mock Email service
jest.unstable_mockModule('../../services/email/email.service', function() {
  return {
    send: jest.fn().mockReturnValue(new Promise(resolve => {resolve({})})),
    validate: jest.fn().mockReturnValue(new Promise(resolve => {resolve({})})),
  }
});
const emailService = (await import('../../services/email/email.service'));

const controller = await import('./contact.controller');


describe ("Contact controller:", function() {
  let req;
  let res;

  beforeEach(async function() {
    req = new Request();
    req.setBody({
      name: "Sender",
      email: "sender@example.com",
      subject: "Subject",
      message: "Test Message"
    });
    res = new Response();
    jest.clearAllMocks();
  });

  describe("Calling controller.send with valid data", function () {
    beforeEach(async function() {
      await controller.send(req, res)
    });

    it("should respond with 200 OK status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should respond with a success flag that is set to true", async function() {
      expect(res.json.mock.calls.length).toBe(1);
      expect(res.json.mock.calls[0][0].success).toBe(true);
    });

    it("should send an email message", async function() {
      const expectedMessage = {
        from: 'Sender <sender@example.com>',
        to: 'info@your-mailgun-domain',
        subject: 'Subject',
        text: 'Test Message'
      };
      expect(emailService.send).toHaveBeenCalledWith(
        expectedMessage
      );
    });
  });

  describe("Calling controller.send with no message", function () {
    beforeEach(async function() {
      const modifiedReq = {body: {...req.body}};
      delete modifiedReq.body.message;
      await controller.send(modifiedReq, res)
    });

    it("should respond with 200 OK status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should respond with a success flag that is set to true", async function() {
      expect(res.json.mock.calls.length).toBe(1);
      expect(res.json.mock.calls[0][0].success).toBe(true);
    });

    it("should send an email with \"No message\"", async function() {
      const expectedMessage = {
        from: 'Sender <sender@example.com>',
        to: 'info@your-mailgun-domain',
        subject: 'Subject',
        text: 'No message'
      };
      expect(emailService.send).toHaveBeenCalledWith(
        expectedMessage
      );
    });
  });
})
