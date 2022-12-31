import express from 'express';
import config from '../config/environment';
import User from '../api/users/user.model';

import localAuth from './local';
import wcaAuth from './wca';

import {setup as localPassportSetup} from './local/passport'
import {setup as wcaPassportSetup} from './wca/passport'

// Passport Configuration
localPassportSetup(User, config);
wcaPassportSetup(User, config);

var router = express.Router();

router.use('/local', localAuth);
router.use('/wca', wcaAuth);

export default router;
