import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import recyclablesController from './controllers/recyclablesController';

import collectionsValidator from './validators/collectionsValidator';
import collectionsController from './controllers/collectionsController';

const routes = Router();
const upload = multer(multerConfig);

// recyclable items:
routes.get('/items', recyclablesController.index);

// collect points:
routes.post(
	'/collect',
	upload.single('image'),
	collectionsValidator.create,
	collectionsController.create
);
routes.get('/collect', collectionsController.index);
routes.get('/collect/:id', collectionsController.show);

export default routes;
