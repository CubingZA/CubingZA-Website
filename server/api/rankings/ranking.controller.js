import sanitize from 'mongo-sanitize';
import Ranking from './ranking.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity !== undefined && entity !== null) {
      return res.status(statusCode).json(entity);
    }
    return res.status(404).end();
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function getRankings(req, res, Ranking) {
  const eventId = sanitize(req.params.event);
  const province = sanitize(req.params.province);
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pagesize) || 100;

  if (pageSize > 100) {
    return res.status(400).send('Maximum pagesize is 100')
  }
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return Ranking.find({
    'eventId': eventId,
    'province': province,
    'provinceRank': {'$gt': start, '$lte': end},
  }, '-userId').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

function getCount(req, res, Ranking) {
  const eventId = sanitize(req.params.event);
  const province = sanitize(req.params.province);

  return Ranking.countDocuments({
    'eventId': eventId,
    'province': province,
  }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getSingleRankings(req, res) {
  return getRankings(req, res, Ranking.Single)
}

export function getAverageRankings(req, res) {
  return getRankings(req, res, Ranking.Average)
}

export function getSingleCount(req, res) {
  return getCount(req, res, Ranking.Single)
}

export function getAverageCount(req, res) {
  return getCount(req, res, Ranking.Average)
}

export function getProvincialRecords(req, res) {
  let hasSingle = false;
  let hasAverage = false;

  let singleRecords = [];
  let averageRecords = [];

  const singlePromise = Ranking.Single.find({
    'provinceRank': 1,
  }, '-userId').exec()
  .then((results) => {
    hasSingle = true;
    singleRecords = results;
  })
  .catch(handleError(res));

  const averagePromise = Ranking.Average.find({
    'provinceRank': 1,
  }, '-userId').exec()
  .then((results) => {
    hasAverage = true;
    averageRecords = results;
  })
  .catch(handleError(res));

  return Promise.all([singlePromise, averagePromise])
  .then(() => {
    if (!hasSingle && !hasAverage) {
      return res.status(404).end();
    }
    return res.status(200).json(combineRecords(singleRecords, averageRecords));
  });
}

function combineRecords(singleRecords, averageRecords) {
  const combinedRecords = {};

  for (let record in singleRecords) {
    let eventId = singleRecords[record].eventId;
    let province = singleRecords[record].province;
    if (combinedRecords[eventId] === undefined) {
      combinedRecords[eventId] = {};
    }
    if (combinedRecords[eventId][province] === undefined) {
      combinedRecords[eventId][province] = {};
    }
    combinedRecords[eventId][province].single = singleRecords[record];
  }
  for (let record in averageRecords) {
    let eventId = averageRecords[record].eventId;
    let province = averageRecords[record].province;
    if (combinedRecords[eventId] === undefined) {
      combinedRecords[eventId] = {};
    }
    if (combinedRecords[eventId][province] === undefined) {
      combinedRecords[eventId][province] = {};
    }
    combinedRecords[eventId][province].average = averageRecords[record];
  }

  return combinedRecords;
}