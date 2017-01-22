'use strict';

var express = require('express');
var controller = require('./record.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.put('/:id', auth.hasRole('admin'), controller.upsert);

module.exports = router;
