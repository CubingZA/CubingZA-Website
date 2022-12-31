import {jest} from '@jest/globals';

const mockClient = {
  messages: {
    create: jest.fn(()=>{
      return new Promise(resolve=>{resolve()});
    })
  }
};
jest.mock('mailgun.js', function() {  
  return jest.fn(()=>({
    client: jest.fn(()=>mockClient)
  }))
});
const Mailgun = (await import('mailgun.js')).default;

const getMockRequest = () => ({
  body: {
    name: "Sender",
    email: "sender@example.com",
    subject: "Subject",
    message: "Test Message"
  }
});

const getMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

const controller = await import('./contact.controller');


describe ("Contact controller:", function() {
  let req;
  let res;

  beforeEach(async function() {    
    req = getMockRequest();
    res = getMockResponse();
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
    
    it("should create a Mailgun message", async function() {
      const expectedMessage = {
        from: 'Sender <sender@example.com>', 
        to: 'info@your-mailgun-domain', 
        subject: 'Subject', 
        text: 'Test Message'
      };
      expect(mockClient.messages.create).toHaveBeenCalledWith(
        process.env.MAILGUN_DOMAIN,
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
    
    it("should create a Mailgun message with \"No message\"", async function() {
      const expectedMessage = {
        from: 'Sender <sender@example.com>', 
        to: 'info@your-mailgun-domain', 
        subject: 'Subject', 
        text: 'No message'
      };
      expect(mockClient.messages.create).toHaveBeenCalledWith(
        process.env.MAILGUN_DOMAIN,
        expectedMessage
      );
    });
  });
})
