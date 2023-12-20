import express from 'express';
import config from '../config/environment/index.js';
import User from '../api/users/user.model.js';

import localAuth from './local/index.js';
import wcaAuth from './wca/index.js';

import {setup as localPassportSetup} from './local/passport.js'
import {setup as wcaPassportSetup} from './wca/passport.js'

// Passport Configuration
localPassportSetup(User, config);
wcaPassportSetup(User, config);

var router = express.Router();

router.use('/local', localAuth);
router.use('/wca', wcaAuth);

export default router;
