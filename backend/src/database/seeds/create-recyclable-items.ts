import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Inserts seed entries
	return await knex('recyclables').insert([
		{ title: 'Lâmpadas', image: 'lampadas.svg' },
		{ title: 'Pilhas e Baterias', image: 'baterias.svg' },
		{ title: 'Papéis e Papelão', image: 'papeis-papelão.svg' },
		{ title: 'Resíduos Eletrônicos', image: 'eletronicos.svg' },
		{ title: 'Resíduos Orgânicos', image: 'organicos.svg' },
		{ title: 'Óleo de Cozinha', image: 'oleo.svg' },
	]);
};
