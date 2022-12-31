import express from 'express';
import * as controller from './localauth.controller';

var router = express.Router();

router.post('/', controller.authenticate);

export default router;
