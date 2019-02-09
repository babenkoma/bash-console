'use strict';

/**
 * @module
 * @licence MIT
 * @author Marina Babenko <babenkoma@gmail.com>
 */

const exec = require('child_process').exec;
const sequest = require('sequest');
const co = require('super-co');
let remoteCmd = {};

function remoteStart (host, user, password) {
	if (host && user && password && !remoteCmd[user + '@' + host]) {
		remoteCmd[user + '@' + host] = sequest(user + '@' + host, {
			password: password
		});
		remoteCmd[user + '@' + host].pipe(process.stdout);
	}
}

function remoteFinish () {
	Object.keys(remoteCmd).forEach((key) => {
		remoteCmd[key].end();
	});
}

function runRemote (command, host, user) {
	return new Promise((resolve, reject) => {
		try {
			if (remoteCmd[user + '@' + host]) {
				console.log("\n");
				console.log(command);
				console.log('---------------------');
				remoteCmd[user + '@' + host].write(command, function (error, data) {
					if (!error) {
						resolve(data);
					} else {
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
 */
function bashConsole (options) {
	let run = (i, j) => {
		return co(function* () {
			const groups = options.groups || [];

			if (groups.length >= i + 1) {
				const group = groups[i];
				const commands = group.commands || [];
				const host = group.host || options.host;
				const user = group.user || options.user;
				const password = group.password || options.password;

				if (commands.length >= j + 1) {
					const command = commands[j];

					if (group.type === 'local') {
						yield runLocal(command);
					} else if (group.type === 'remote') {
						remoteStart(host, user, password);
						yield runRemote(command, host, user);
						console.log(i, j)
					}

					yield run(i, j + 1);
				} else {
					yield run(i + 1, 0);
				}
			}
		});
	};

	run(0, 0).then((data) => {
		remoteFinish();
	}).catch((error) => {
		remoteFinish();
		throw new Error(error);
	});
}

/**
 * Exports
 */
module.exports = bashConsole;
