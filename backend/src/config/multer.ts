import multer from 'multer';
import { v4 as uuid4 } from 'uuid';
import path from 'path';

export default {
	storage: multer.diskStorage({
		destination: path.resolve(__dirname, '..', '..', 'uploads'),
		filename(req, file, callback) {
			const id = uuid4();

			const filename = `${id}-${file.originalname}`;

			callback(null, filename);
		}
	})
}
