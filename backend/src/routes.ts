import { Router, Request, Response } from 'express';

import recyclablesController from './controllers/recyclablesController';
import collectionsController from './controllers/collectionsController';

const routes = Router();

// recyclable items:
routes.get('/items', recyclablesController.index);

// collect points:
routes.post('/collect', collectionsController.create);
routes.get('/collect', collectionsController.index);
routes.get('/collect/:id', collectionsController.show);

export default routes;
