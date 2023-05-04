import passport from 'passport';
import {signToken} from '../auth.service';

export function authenticate(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if(error) {
      console.log(info);
      return res.status(401).json(error);
    }
    if(!user) {
      // Should not be possible to get here.
      // There should either be an error or an authenticated user.
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }

    var token = signToken(user._id, user.role);
    res.cookie('token', token);
    res.status(200).json({ token });
  })(req, res, next);
}
