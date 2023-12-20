import NodeCache from 'node-cache';
import * as emailService from '../../services/email/email.service.js';

const cache = new NodeCache({stdTTL: 60, checkperiod: 120});
const inProgressCache = new NodeCache({stdTTL: 60, checkperiod: 120});

export function check(req, res) {
  var email = req.body.email;

  const result = cache.get(email);

  // Note: we have to check explicitly for undefined, because null
  // is a valid value for the result that we want to cache.
  if (result !== undefined) {
    console.log("Email check cache hit.");
    res.status(200).json(result);

  } else if (inProgressCache.get(email)) {
    console.log("Duplicate email check request. Ignoring.");
    res.status(429).json({message: "Email validation already in progress"});

  } else {

    inProgressCache.set(email, true, 60);

    console.log("Email check cache miss. Requires api call.", email);

    emailService.validate(email)
    .then((data) => {
      inProgressCache.del(email);
      console.log("result for email:", email);
      const result = checkResult(data);
      cache.set(email, result, 7200)
      res.status(200).json(result);
    })
    .catch((err) => {
      inProgressCache.del(email);
      console.log(err);
      res.status(503).json({message: "Error validating email address"})
    });
  }
}

function checkResult(data) {
  let result = {
    valid: true
  }

  if (data.did_you_mean) {
    result.did_you_mean = data.did_you_mean;
  }

  if (data.result === 'undeliverable') {
    result.valid = false;
    result.message = "Email address is not a deliverable address";
  }

  return result;
}

