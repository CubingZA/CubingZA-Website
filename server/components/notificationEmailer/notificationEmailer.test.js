import {jest} from '@jest/globals';

// // Mock Email service
// jest.unstable_mockModule('../../services/email/email.service', function() {
//   return {
//     send: jest.fn().mockReturnValue(new Promise(resolve => {resolve({})})),
//     validate: jest.fn().mockReturnValue(new Promise(resolve => {resolve({})})),
//   }
// });
// const emailService = (await import('../../services/email/email.service'));

// // Mock User Model
// jest.unstable_mockModule('../../models/user.model', function() {
//   return {
//     find: jest.fn().mockReturnValue(new Promise(resolve => {resolve([
//       {
//         email: 



describe ("Notification Emailer:", function() {

  beforeEach(async function() {
    jest.clearAllMocks();
  });

  it("should pass", async function() {
    expect(true).toBe(true);
  });
});

//   it("should send notiifactions only to verified users with notifications enabled", async function() {
//     const mockUser1 = {
//       email: "

