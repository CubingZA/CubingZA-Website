import express from 'express';
import * as controller from './event.controller';
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/upcoming', controller.upcoming);
router.post('/', auth.hasRole('admin'), controller.create);
router.post('/:id/notify', auth.hasRole('admin'), controller.sendNotifications);
router.delete('/', auth.hasRole('admin'), controller.destroy);
router.put('/:id', auth.hasRole('admin'), controller.upsert);
router.patch('/:id', auth.hasRole('admin'), controller.patch);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

export default router;
