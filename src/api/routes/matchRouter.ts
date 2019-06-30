import express from 'express';
import matchController from '../controllers/matchController';
import { checkJwt } from '../../common/checkJwt';

const matchRouter = express.Router();

matchRouter.post('/:id/join', checkJwt, matchController.joinMatch);
matchRouter.get('/:id', checkJwt, matchController.getById);
matchRouter.get('/:id/moves', checkJwt, matchController.getMoves);
matchRouter.post('/create', checkJwt, matchController.createMatch);

export default matchRouter;
