'use strict';

/**
 * @module
 * @licence MIT
 * @author Marina Babenko <babenkoma@gmail.com>
 */

const exec = require('child_process').exec;
const sequest = require('sequest');
const co = require('super-co');

/**
 * Run single or multiple (with &&) command on remote server throw ssh
 * @param command
 * @param host
 * @param user
 * @param password
 * @returns {Promise}
 */
function runRemote (command, host, user, password) {
	return new Promise((resolve, reject) => {
		try {
			if (host !== undefined && user !== undefined && password !== undefined) {
				let remoteCmd = sequest(user + '@' + host, {
					password: password
				});
				remoteCmd.pipe(process.stdout);
				remoteCmd.write(command, function (error, data) {
					if (!error) {
						remoteCmd.end();
						resolve(data);
					} else {
						remoteCmd.end();
						throw new Error(error);
					}
				});
			} else {
				resolve();
			}
		} catch (error) {
			throw new Error(error);
		}
	});
}

/**
 * Run single command on local console
 * @param command
 * @returns {Promise}
 */
function runLocal (command) {
	return new Promise((resolve, reject) => {
		try {
			console.log("\n");
			console.log(command);
			console.log('---------------------');

			let cmdProcess = exec(command, {}, (error, data) => {
				if (!error) {
					console.log(data);
					resolve(data);
				} else {
					throw new Error(error);
				}
			});

			cmdProcess.on('exit', function() {
				cmdProcess.kill();
			});
		} catch (error) {
			throw new Error(error);
		}
	});
}

/**
 * Bash console function
 * @param options
 * @returns {Promise}
 */
function bashConsole (options) {
	return co(function* () {
		const groups = options.groups || [];

		yield co.forEach(groups, (group) => {
			const host = group.host || options.host;
			const user = group.user || options.user;
			const password = group.password || options.password;
			const commands = group.commands || [];

			return co(function* () {
				if (group.type === 'local') {
					console.log("\n\n*********************\nLocal console\n*********************");
					yield co.forEach(commands, (command) => {
						return runLocal(command);
					});
				} else if (group.type === 'remote') {
					let list = [];
					list.push('echo -e "\n\n*********************\nRemote connection ' + user + '@' + host + '\n*********************"');
					commands.forEach((command) => {
						list.push('echo -e "\n\n' + command + '\n---------------------"');
						list.push(command);
					});
					yield runRemote(list.join(' && '), host, user, password);
				}
			});
		});
	});
}

/**
 * Exports
 */
module.exports = bashConsole;
