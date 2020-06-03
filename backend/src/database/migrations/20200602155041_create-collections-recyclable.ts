import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable('collections_recyclables', table => {
		table.increments('id').primary();

		table.integer('collections_id')
			.notNullable()
			.references('id')
			.inTable('collections');

		table.integer('recyclables_id')
			.notNullable()
			.references('id')
			.inTable('recyclables');
	});
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.dropTable('collections_recyclables');
}

