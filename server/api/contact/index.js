import express from 'express';
import * as controller from './contact.controller.js';

var router = express.Router();

router.post('/send', controller.send);

export default router;
