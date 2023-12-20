import express from 'express';
import * as controller from './record.controller.js';
import * as auth from '../../auth/auth.service.js';

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.put('/:id', auth.hasRole('admin'), controller.upsert);

export default router;
