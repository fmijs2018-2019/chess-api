import express from 'express';
import matchController from '../controllers/matchController';
import { checkJwt } from '../../checkJwt';

const matchRouter = express.Router();

matchRouter.post('/:id/join', checkJwt, matchController.joinMatch);
matchRouter.get('', checkJwt, matchController.getAll);
matchRouter.post('/create', checkJwt, matchController.createMatch);

export default matchRouter;
