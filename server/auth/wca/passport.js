
import axios from 'axios'
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2'


function wcaAuthenticate(User, accessToken, done) {
  let userURL = process.env.WCA_USER_API_URL;
  let wcaUserOptions = {
    headers: {
      Authorization: 'Bearer '+accessToken,
    }
  };
  return axios.get(userURL, wcaUserOptions)
    .then((response) => {
      if (response.status !== 200) {
        return done(null, null, {message: 'Error retrieving WCA profile ('+res.statusCode+')'});
      }
      return response.data;
    })
    .then(data => {
      var wcaProfile = data.me;
      if (!wcaProfile) {
        return done(null, null, {message: 'No WCA profile retrieved'});
      }
      // Attempt to find the user in the database
      return User.findOne({
        email: wcaProfile.email.toLowerCase()
      }).exec()
      .then(user => {
        if(!user) {
          // User does not exist, need to create
          var user = new User({
            name: wcaProfile.name,
            email: wcaProfile.email.toLowerCase(),
            provider: ['wca'],
            role: 'user',
            wcaID: wcaProfile.wca_id,
            wcaCountryID: wcaProfile.country_iso2,
          });

          return user.save()
            .then((user) => {
              // Created new user.
              user.wcaProfile = wcaProfile;
              return done(null, user);
            });
        }
        else {
          // User already exists.
          return updateUserWithWCAProfile(user, wcaProfile)
          .then(user => {
            user.wcaProfile = wcaProfile;
            return done(null, user);
          });
        }
      })
      .catch(err => {
        return done(err, null, {message: 'Caught error'})
      });
    })
    .catch(err => {
      return done(err, null);
    });
}

function updateUserWithWCAProfile(user, wcaProfile) {
  // Should never have a email mismatch, but check just in case
  if (user.email.toLowerCase() !== wcaProfile.email.toLowerCase()) {
    return Promise.resolve(user);
  }

  // Never update if not a WCA user
  if (!user.provider.includes('wca')) {
    return Promise.resolve(user);
  }

  let hasChanges = false;
  if (user.wcaID !== wcaProfile.wca_id) {
    user.wcaID = wcaProfile.wca_id;
    hasChanges = true;
  }
  if (user.wcaCountryID !== wcaProfile.country_iso2) {
    user.wcaCountryID = wcaProfile.country_iso2;
    hasChanges = true;
  }
  if (user.name !== wcaProfile.name) {
    user.name = wcaProfile.name;
    hasChanges = true;
  }

  if (hasChanges) {
    return user.save();
  } else {
    return Promise.resolve(user);
  }
}


export function setup(User, config) {
  passport.use(new OAuth2Strategy({
    authorizationURL: process.env.WCA_OAUTH_URL,
    tokenURL: process.env.WCA_OAUTH_TOKEN_URL,
    clientID: process.env.WCA_OAUTH_CLIENT_ID,
    clientSecret: process.env.WCA_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.WCA_OAUTH_CALLBACKURL,
    scope: ['public', 'email'],
    store: true
  }, function(accessToken, refreshToken, profile, done) {
    wcaAuthenticate(User, accessToken, done);
  }));
}
