const bash = require('../index');

bash({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	groups: [
		{
			type: 'local',
			commands: [
				'node --version',
				'npm --version'
			]
		},
		{
			type: 'remote',
			commands: [
				'node --version',
				'npm --version'
			]
		},
		{
			type: 'remote',
			host: '127.0.0.1',
			user: 'user',
			password: '',
			commands: [
				'node --version',
				'npm --version'
			]
		}
	]
}).then((data) => {
	console.log('Do something ...');
}).catch((error) => {
	throw new Error(error);
});
