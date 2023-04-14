import express from 'express';
import * as controller from './wcaauth.controller';

var router = express.Router();

// User will be sent to /auth/wca when they first try to log in.
// They will then be redirected to the WCA OAuth page to authorize the log in.
router.get('/', controller.authenticate);

// The WCA OAuth page will redirect the user here once they are authenticated.
router.get('/callback', controller.callback);

router.get('/login', controller.finalLogin);

export default router;
