# Bash console
Bash console for local and remote commands

## Install
```
npm i bash-console
```

## Using
```JS
const bash = require('bash-console');
 
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
      host: '127.0.0.1',
      user: 'user',
      password: '',
      commands: [
        'node --version',
        'npm --version'
      ]
    }
	]
});
```
## Global options
### host, user, password - data for remote connection throw ssh
### groups - groups command, which run lo local or remote server

## Group options
### host, user, password - data for remote connection throw ssh. If not set, then used global data
### commands - array of commands

## Detail
See [tests](https://github.com/babenkoma/bash-console/blob/master/test/index.js)

## License
MIT
