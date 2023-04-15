import {jest} from '@jest/globals';


export function getMockRequest(params, body, auth) {
  return {
    params: params ? params : {},
    body: body ? body : {},
    auth: auth ? auth : {},
    headers: {},
  };
}

export function getMockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
}