const console = require('../index');

console({
	host: '195.201.39.33',
	user: 'admin',
	password: 'PctM!A5K?XhLZzT',
	groups: [
		{
			type: 'local',
			commands: [
				'git status',
				'git --version'
			]
		},
		{
			type: 'remote',
			commands: [
				'cd /home/admin/web/nina-barhat.wezom.agency/public_html',
				'ls',
				'git --version'
			]
		}
	]

});
