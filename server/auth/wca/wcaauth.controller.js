import passport from 'passport';
import {signToken} from '../auth.service';

export function authenticate(req, res, callback) {
  const next = req.query.next || null;
  req.session.redirectURL = next;
  passport.authenticate('oauth2')(req, res, callback);
}

export function callback(req, res, callback) {
  passport.authenticate('oauth2', function(err, user, info) {

    if (user) {
      var token = signToken(user._id, user.role);
      if (req.session.redirectURL) {
        // Came from the UI
        return res.cookie('token', token).redirect(req.session.redirectURL);
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
  console.log("Final login");
  console.log(req);
  return next(res);
}