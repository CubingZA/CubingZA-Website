import passport from 'passport';
import {signToken} from '../auth.service';

export function authenticate(req, res, next) {
  passport.authenticate('oauth2', {
    state: (req.query.state || "/")
  })(req, res, next);
}

export function callback(req, res, next) {
  let state = Buffer.from(req.query.state, 'base64url').toString();
  passport.authenticate('oauth2', {failureRedirect: '/login'}, function(err, user, info) {    
    if (err) {
      return res.redirect('/login');
    }
    else {
      var token = signToken(user._id, user.role);
      return res.cookie('token', token).redirect(state);
    }
  })(req, res, next);
}

export function finalLogin(req, res, next) {
  console.log("Final login");
  console.log(req);
  return next(res);
}