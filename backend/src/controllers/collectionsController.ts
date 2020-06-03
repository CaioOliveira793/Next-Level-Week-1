import knex from '../database/connection';
import { Request, Response } from 'express';


export default {
	async show(req: Request, res: Response) {
		const { id } = req.params;

		const point = await knex('collections').where('id', id).first();

		if (!point)
			return res.status(400).json({ message: 'Point not found' });

		const items = await knex('recyclables')
			.join('collections_recyclables', 'recyclables.id', '=', 'collections_recyclables.recyclables_id')
			.where('collections_recyclables.collections_id', id)
			.column('recyclables.id', 'title');

		return res.json({ point, items });
	},

	async index(req: Request, res: Response) {
		const { city, uf, items } = req.query;

		const parsedItems = String(items)
			.split(',')
			.map(item => Number(item.trim()));

		const points = await knex('collections')
			.join('collections_recyclables', 'collections.id', '=', 'collections_recyclables.collections_id')
			.whereIn('collections_recyclables.recyclables_id', parsedItems)
			.where({
				city: String(city),
				uf: String(uf)
			})
			.distinct()
			.columns('collections.*');

		return res.json(points);
	},

	async create(req: Request, res: Response) {
		const {
			name,
			email,
			whatsapp,
			latitude,
			longitude,
			city,
			uf,
			items
		} = req.body;

		const trx = await knex.transaction();

		const collectPoint = {
			name,
			email,
			whatsapp,
			latitude,
			longitude,
			city,
			uf,
			image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80'
		}

		const [insertedId] = await trx('collections').insert(collectPoint);

		const pointItems = items.map((item_id: number) => {
			return {
				recyclables_id: item_id,
				collections_id: insertedId
			}
		});

		await trx('collections_recyclables').insert(pointItems);

		await trx.commit();

		return res.json({
			id: insertedId,
			...collectPoint
		});
	}
}
