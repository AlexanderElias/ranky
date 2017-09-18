const Pck = require('../package');
const Ranky = require('../index');
const Cmd = require('commander');

Cmd
.version(Pck.version)
.usage('<term> <domain> [options]')
.option('-o, --output <path>', 'Output path to file')
.action(function (term, domain, options) {
	if (!term) return console.error('Term name argument required');
	if (!domain) return console.error('Domain name argument required');

	Ranky.position(domain, term).then(function (result) {
		if (options.output) {
			return Ranky.toFile(options.output, result);
		} else {
			console.log(result);
		}
	}).catch(function (error) {
		console.error(error);
	});
})
.parse(process.argv);
