import passport from 'passport';
import {signToken} from '../auth.service.js';


export function authenticate(req, res, callback) {
  const next = req.query.next || "";
  req.session.redirectUrl = next;
  req.session.isMerge = (req.auth ? true : false);
  req.session.mergeUser = req.auth;
  passport.authenticate('oauth2')(req, res, callback);
}

export function callback(req, res, callback) {
  passport.authenticate('oauth2', function(err, user, info) {
    var error = err || info;
    if(error && Object.keys(error).length !== 0) {
      return res.redirect(`${req.session.redirectUrl}/login`);
    }
    if (user) {
      if (req.session.isMerge) {
        mergeWcaUser(user, req.session.mergeUser, function(err) {
          if (err) {
            return res.redirect(`${req.session.redirectUrl}/login`);
          } else {
            return res.redirect(req.session.redirectUrl);
          }
        });
      } else {
        if (user.provider.indexOf('wca') === -1) {
          const message = "WCA login not enabled for this account."
          return res.redirect(`${req.session.redirectUrl}/login`);
        }

        var token = signToken(user._id, user.role);
        if (req.session.redirectUrl) {
          // Came from the UI
          return res.cookie('token', token).redirect(req.session.redirectUrl);
        } else {
          // Came from the API
          return res.json({ token });
        }
      }
    } else {
      // Should not be possible to get here.
      // There should either be an error or an authenticated user.
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }
  })(req, res, callback);
}

export function finalLogin(req, res, next) {
  return next(res);
}

function mergeWcaUser(user, authUser, callback) {
  // Emails must match to merge
  if (authUser && user.email !== authUser.email) {
    return callback(new Error('Emails do not match.'));
  }

  // Merge the WCA user into the local user
  const wcaProfile = user.wcaProfile;
  delete user.wcaProfile;
  if (!user.provider.includes('wca')) {
    user.provider.push('wca');
  }
  user.name = wcaProfile.name;
  user.wcaID = wcaProfile.wca_id;
  user.wcaCountryID = wcaProfile.country_iso2;

  // Save the user
  user.save()
  .then(user => {
    callback(null);
  })
  .catch(err => {
    callback(err);
  })
}