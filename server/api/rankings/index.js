import express from 'express';
import * as controller from './ranking.controller';

var router = express.Router();

router.get('/:province/:event/single', controller.getSingleRankings);
router.get('/:province/:event/single/count', controller.getSingleCount);

router.get('/:province/:event/average', controller.getAverageRankings);
router.get('/:province/:event/average/count', controller.getAverageCount);

router.get('/records', controller.getProvincialRecords);

export default router;
