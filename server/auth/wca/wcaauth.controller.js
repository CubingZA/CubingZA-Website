import passport from 'passport';
import {signToken} from '../auth.service';



import { inspect } from 'util' // TODO: Remove this


export function authenticate(req, res, callback) {
  const next = req.query.next || null;
  req.session.redirectUrl = next;
  passport.authenticate('oauth2')(req, res, callback);
}

export function callback(req, res, callback) {
  passport.authenticate('oauth2', function(err, user, info) {
    if (user) {
      var token = signToken(user._id, user.role);
      if (req.session.redirectUrl) {
        // Came from the UI
        return res.cookie('token', token).redirect(req.session.redirectUrl);
      } else {
        // Came from the API
        return res.json({ token });
      }
    } else {
      return res.redirect('/login');
    }
  })(req, res, callback);
}

export function finalLogin(req, res, next) {
  return next(res);
}
