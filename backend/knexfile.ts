import path from 'path';

// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'src', 'database', 'dev.sqlite')
    },
		migrations: {
			directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
			extension: 'ts'
		},
		seeds: {
			directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
			extension: 'ts'
		},
		useNullAsDefault: true
  },

};
