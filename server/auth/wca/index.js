'use strict';

import express from 'express';
import passport from 'passport';
import {signToken} from '../auth.service';

var router = express.Router();

// User will be sent to /auth/wca when they first try to log in.
// They will then be redirected to the WCA OAuth page to authorize the log in.
router.get('/', passport.authenticate('oauth2'));

// The WCA OAuth page will redirect the user here once they are authenticated.
router.get('/callback', function(req, res, next) {
  passport.authenticate('oauth2', {failureRedirect: '/login'}, function(err, user, info) {
    if (err) {
      return res.redirect('/login');
    }
    else {
      var token = signToken(user._id, user.role);
      res.cookie('user-token', token);
      return res.redirect('/login/wca');
    }
  })(req, res, next);
});


export default router;
