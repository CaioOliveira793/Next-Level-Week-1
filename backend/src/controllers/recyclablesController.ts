import knex from '../database/connection';
import { Request, Response } from 'express';


export default {
	async index(req: Request, res: Response) {
		const items = await knex('recyclables').select('*');

		const serializedItems = items.map(item => {
			return {
				id: item.id,
				title: item.title,
				image_url: `http://192.168.0.10:3333/uploads/${item.image}`
			}
		});

		return res.json(serializedItems);
	}
}
