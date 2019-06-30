import express from 'express';
import { checkJwt } from '../../common/checkJwt';
import statisticsController from '../controllers/statisticsController';

const statisticsRouter = express.Router();

statisticsRouter.get('/', checkJwt, statisticsController.getByUserId);

export default statisticsRouter;
