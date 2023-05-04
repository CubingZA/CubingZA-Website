import {jest} from '@jest/globals';
import mockingoose from 'mockingoose';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

// Mock notificationEmailer
jest.unstable_mockModule('../../components/notificationEmailer/notificationEmailer', ()=>({
  default: jest.fn(()=>{})
}));
const sendNotificationEmails = (await import('../../components/notificationEmailer/notificationEmailer')).default;

const Event = (await import('./event.model')).default;
const controller = await import('./event.controller');


const mockEventData = [
  {
    name:"Test Competition",
    venue: "Test Venue",
    address: "Test Address",
    city: "Test City",
    province: "Test Province",
    registrationName: "TestRegistrationName",
    notificationsSent: false
  },
  {
    name:"Another one",
    venue: "Somewhere Else",
    address: "1234 Test Street",
    city: "Place Town",
    province: "West Otherwhere",
    registrationName: "AnotherCompetition",
    notificationsSent: true
  }
];


describe ("Event controller:", function() {
  let req;
  let res;

  beforeEach(async function() {
    req = new Request();
    req.setBody({});
    res = new Response();
    jest.clearAllMocks();
    mockingoose.resetAll();
  });

  describe("Calling controller.index", function () {
    describe("with no error", function () {
      beforeEach(async function() {
        mockingoose(Event).toReturn(mockEventData, 'find');
        await controller.index(req, res)
      });

      it("should respond with 200 OK status", async function() {
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it("should respond with json containing list of all events", async function() {
        mockEventData.forEach(event => {
          expect(res.json).toHaveBeenCalledWith(
            expect.arrayContaining([expect.objectContaining(event)])
          );
        });
      });
    });

    describe("with error", function () {

      const dbError = new Error('Database error');

      beforeEach(async function() {
        mockingoose(Event).toReturn(dbError, 'find');
        await controller.index(req, res)
      });

      it("should respond with 500 Internal Server Error status", async function() {
        expect(res.status).toHaveBeenCalledWith(500);
      });

      it("should respond with json containing error message", async function() {
        expect(res.send).toHaveBeenCalledWith(dbError);
      });
    });
  });

  describe("Calling controller.show", function () {
    beforeEach(async function() {
      mockingoose(Event).toReturn(mockEventData[0], 'findOne');
      await controller.show(req, res)
    });

    it("should respond with 200 OK status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should respond with json of a single event", async function() {
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining(mockEventData[0])
      );
    });
  });

  describe("Calling controller.upsert", function () {
    beforeEach(async function() {
      mockingoose(Event).toReturn(mockEventData[0], 'findOneAndUpdate');
      await controller.upsert(req, res)
    });

    it("should respond with 200 OK status", async function() {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should respond with json of a single event", async function() {
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining(mockEventData[0])
      );
    });
  });

  describe("Calling controller.create", function () {

      let createSpy;

      beforeEach(async function() {
        req.body = mockEventData[0];
        createSpy = jest.spyOn(Event, 'create');
        await controller.create(req, res)
      });

      it("should respond with 201 Created status", async function() {
        expect(res.status).toHaveBeenCalledWith(201);
      });

      it("should call the model's create method with the request body", async function() {
        expect(createSpy).toHaveBeenCalledWith(req.body);
      });
  });

  describe("Calling controller.destroy", function () {
    describe("with no params", function () {

      let deleteEvent;

      beforeEach(async function() {
        deleteEvent = new Event(mockEventData[0]);
        req.params.id = "1";
        mockingoose(Event).toReturn(deleteEvent, 'findById');
        mockingoose(Event).toReturn(deleteEvent, 'findOne');
        await controller.destroy(req, res)
      });

      it("should respond with 204 No Content status", async function() {
        expect(res.status).toHaveBeenCalledWith(204);
      });

      it("should have all events in the document and then call remove", async function() {
        expect(deleteEvent.remove).toHaveBeenCalled();
      });

      it("should end the response with no data", async function() {
        expect(res.end).toHaveBeenCalled();
      });
    });

    describe("when no event is found", function () {
      beforeEach(async function() {
        mockingoose(Event).toReturn(null, 'findById');
        mockingoose(Event).toReturn(null, 'findOne');
        await controller.destroy(req, res)
      });

      it("should respond with 404 Not Found status", async function() {
        expect(res.status).toHaveBeenCalledWith(404);
      });

      it("should end the response with no data", async function() {
        expect(res.end).toHaveBeenCalledWith();
      });
    });
  });

  describe("Calling controller.sendNotifications", function () {

    describe("when no event is found", function () {
      beforeEach(async function() {
        mockingoose(Event).toReturn(null, 'findById');
        mockingoose(Event).toReturn(null, 'findOne');
        await controller.sendNotifications(req, res)
      });

      it("should respond with 404 Not Found status", async function() {
        expect(res.status).toHaveBeenCalledWith(404);
      });

      it("should end the response with no data", async function() {
        expect(res.end).toHaveBeenCalledWith();
      });
    });

    // describe("when the event has already had notifications sent", function () {

    // });

    describe("when the event has not had notifications sent", function () {

      let sendEvent;

      beforeEach(async function() {
        sendEvent = new Event(mockEventData[0]);
        mockingoose(Event).toReturn(sendEvent, 'findById');
        mockingoose(Event).toReturn(sendEvent, 'findOne');
        expect(sendEvent.notificationsSent).toBe(false);
        await controller.sendNotifications(req, res)
      });

      it("should respond with 200 OK status and success message", async function() {
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: 'success'});
      });

      it("should send notification emails for the competition", async function() {
        expect(sendNotificationEmails).toHaveBeenCalledWith(sendEvent);
      });

      it("should set the notificationsSent flag to true", async function() {
        expect(sendEvent.notificationsSent).toBe(true);
      });
    });

  });
})
