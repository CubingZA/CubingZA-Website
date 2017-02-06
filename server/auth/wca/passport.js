
import request from 'request'
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2'

  
function wcaAuthenticate(User, accessToken, done) {
  var wcaUserAPI = {
    url: 'https://www.worldcubeassociation.org/api/v0/me',
    method: 'GET',
    headers: {
      Authorization: 'Bearer '+accessToken,
    }
  };
  
  return request.get(wcaUserAPI, (err, res, data) => {
    if (err) {
      return done(err);
    }
    else if (res.statusCode !== 200) {
      return done(null, null, {message: 'Error retrieving WCA profile ('+res.statusCode+')'});
    } 
    else {
      
      var wcaProfile = JSON.parse(data).me;
      
      if (!wcaProfile) {
        return done(null, null, {message: 'No WCA profile retrieved'});
      }
      
      // Attempt to find the user in the database
      User.findOne({
        email: wcaProfile.email.toLowerCase(),
        provider: 'wca'
      }).exec()
      .then(user => {
        if(!user) {
          // User does not exist, need to create
          console.log('Need to create a new user')
          
          var user = new User({
            name: wcaProfile.name,
            email: wcaProfile.email.toLowerCase(),
            provider: 'wca',
            role: 'user'
          });
          
          user.save()
            .then((user) => {
              console.log('Created user');
              console.log(done);
              return done(null, user);
            });
        }
        else {
          // User already exists.
          
          console.log('Need to create a new user');          
          console.log(user);          
          return done(null, user);
        }
      })
      .catch(err => {return done(err, null, {message: 'Caught error'})});
    }
  });
}
    
export function setup(User/*, config*/) {
  passport.use(new OAuth2Strategy({
    authorizationURL: 'https://www.worldcubeassociation.org/oauth/authorize',
    tokenURL: 'https://www.worldcubeassociation.org/oauth/token',
    clientID: process.env.WCA_OAUTH_CLIENT_ID,
    clientSecret: process.env.WCA_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.WCA_OAUTH_CALLBACKURL,
    scope: 'public email'
  }, function(accessToken, refreshToken, profile, done) {
    return wcaAuthenticate(User, accessToken, done);
  }));
}
