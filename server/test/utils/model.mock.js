import {jest} from '@jest/globals';

jest.mock('mongoose');
export const mongoose = (await import('mongoose'));


export function getMockModel(mockItems, filterId, customMethods) {
  if (!filterId) {
    filterId = '_id';
  }

  const Model = mongoose.Model;
  const query = mongoose.Query;
  let document = mongoose.Document;
  Object.assign(document, customMethods);
  
  Model.mockItems = mockItems;

  Model.setMockItems = (items) => {
    Model.mockItems = items;
  };

  let currentModel = {};

  query._filter = undefined;

  const makeReplyWithWithQuery = type => (filter)=>{
    query._filter = (type==='id' || !filter) ?
      filter :
      filter[filterId];
    return query
  };

  Model.find = jest.fn(makeReplyWithWithQuery());
  Model.findOne = jest.fn(makeReplyWithWithQuery());
  Model.findById = jest.fn(makeReplyWithWithQuery('id'));
  Model.findOneAndUpdate = jest.fn(makeReplyWithWithQuery());
  Model.findByIdAndRemove = jest.fn(makeReplyWithWithQuery('id'));

  const makeFunToFilterAndPromiseDoc = () => jest.fn(()=>{
    return new Promise(resolve => {
      let result = query._filter ? 
        Model.mockItems.filter((item) => item._id === query._filter)[0] : 
        Model.mockItems;
      if (result) {
        if (Array.isArray(result)) {
          result._rawResult = [...result];
        } else {
          result._rawResult = {...result};
        }
        Object.assign(result, document);
      }
      document.data = result;
      resolve(result);
    });
  });

  const makeFunToPromiseCurrentModel = () => jest.fn(()=>{
    return new Promise(resolve => {
      resolve(currentModel);
    });
  });

  query.exec = makeFunToFilterAndPromiseDoc();

  Model.create = makeFunToFilterAndPromiseDoc();
  Model.remove = makeFunToFilterAndPromiseDoc();  
  jest.spyOn(Model.prototype, 'constructor')
    .mockImplementation(function (data) {
      Object.assign(this, data);
      return this;
    });
  jest.spyOn(Model.prototype, 'save')
    .mockImplementation(makeFunToPromiseCurrentModel());

  Model.save = makeFunToFilterAndPromiseDoc();
  document.save = makeFunToFilterAndPromiseDoc();
  document.remove = makeFunToFilterAndPromiseDoc();

  return Model;
}

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