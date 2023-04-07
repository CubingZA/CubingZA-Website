import express from 'express';
import * as controller from './event.controller';
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.post('/', auth.hasRole('admin'), controller.create);
router.get('/upcoming', controller.upcoming);

router.get('/:id', controller.show);
router.put('/:id', auth.hasRole('admin'), controller.upsert);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

router.post('/:id/notify', auth.hasRole('admin'), controller.sendNotifications);

export default router;
