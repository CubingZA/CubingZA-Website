import { Router } from 'express';
import * as controller from './user.controller.js';
import * as auth from '../../auth/auth.service.js';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/me/notifications',  auth.hasRole('user'), controller.getNotifications);
router.post('/me/notifications', auth.hasRole('user'), controller.saveNotifications);
router.post('/me/verifications/send', auth.hasRole('unverified'), controller.sendVerificationEmail);
router.put('/me/homeprovince', auth.isAuthenticated(), controller.updateHomeProvince);
router.post('/verify', controller.verify);
router.put('/:id/password', auth.hasRole('user'), controller.changePassword);
router.get('/:id', auth.hasRole('user'), controller.show);
router.post('/', controller.create);

export default router;
