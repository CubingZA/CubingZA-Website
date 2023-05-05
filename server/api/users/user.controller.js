import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from './user.model';
import config from '../../config/environment';

import * as emailService from '../../services/email/email.service';


function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  const newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'unverified';
  newUser.verificationToken = crypto.randomBytes(24).toString('hex');
  return newUser.save()
    .then(function(user) {
      sendVerificationEmailHelper(user);
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      return res.status(201).json({ token });
    })
    .catch(validationError(res, 400));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      return res.status(200).json(user);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function(user) {
      if(!user) {
        return res.status(404).end();
      } else {
        return res.status(204).end();
      }
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.auth._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.auth._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      return res.status(200).json(user);
    })
    .catch(err => next(err));
}

/**
 * Get Notifications for current user
 */
export function getNotifications(req, res, next) {
  var userId = req.auth._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      return res.status(200).json(user.notificationSettings);
    })
    .catch(err => next(err));
}

/**
 * Save notifications for current user
 */
export function saveNotifications(req, res) {
  var userId = req.auth._id;
  var notifications = req.body;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(401).end();
      }
      user.notificationSettings = notifications;
      return user.save()
        .then(() => {
          return res.status(204).end();
        })
        .catch(err => handleError(err));
    });
}

export function verify(req, res) {
  var userId = req.body.id;
  var verificationToken = req.body.verificationToken;
  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        console.log('User not found', userId)
        return res.status(401).end();
      }
      if (user.role === 'unverified' && verificationToken === user.verificationToken) {
        user.role = 'user';
        return user.save()
        .then(() => {
          return res.status(200).json({
            success: true,
            message: 'Message successfully sent'
          });
        })
        .catch(err => {
          handleError(err)
        });
      } else {
        return res.status(401).end();
      }
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: 'Could not verify user'
      })
    });
}

/**
 * Send verification email for current user
 */
export function sendVerificationEmail(req, res) {
  var userId = req.auth._id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(401).end();
      }

      sendVerificationEmailHelper(user)
        .then(success=>{
          if (success) {
            return res.status(200).json({
              success: true,
              message: 'Message successfully sent'
            });
          } else {
            return res.status(500).json({
              success: false,
              error: 'Error sending message'
            });
          }
        });
    });
}

function sendVerificationEmailHelper(user) {
  var emailLink = `${process.env.DOMAIN}/verify/${user._id}#${user.verificationToken}`

  let message = {
    from: `CubingZA <info@m.cubingza.org>` ,
    to: `${user.name} <${user.email}>`,
    subject: 'Please verify your email address',
    text: `Hi ${user.name}. Your CubingZA account has been created. To access the full site functionality, please verify your email address by clicking the following link: ${emailLink}`,
    html: `Hi ${user.name}<br/><br/>Your CubingZA account has been created. To access the full site functionality, please <a href="${emailLink}">click here</a> to verify your email address`
  }

  return emailService.send(message)
    .then(body=>{
      return true;
    })
    .catch(err=>{
      console.log(err);
      return false;
    });
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
