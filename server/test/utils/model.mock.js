import {jest} from '@jest/globals';


export function getMockRequest(params, body, auth) {
  return {
    params: params ? params : {},
    auth: auth ? auth : {},
    body: body ? body : {}
  };
}

export function getMockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
}