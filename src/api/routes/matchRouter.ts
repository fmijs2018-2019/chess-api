import express from 'express';
import gameController from '../controllers/matchController';

const gameRouter = express.Router();

gameRouter.get('/', gameController.getAll);
gameRouter.get('/open', gameController.getOpen);
gameRouter.get(':id/join', gameController.joinMatch);

export default gameRouter;
