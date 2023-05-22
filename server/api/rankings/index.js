import express from 'express';
import * as controller from './ranking.controller';

var router = express.Router();

router.get('/:province/:event/single', controller.getSingleRankings);
router.get('/:province/:event/average', controller.getAverageRankings);

export default router;