const Https = require('https');
const Path = require('path');
const Fs = require('fs');

const TOTAL = 100;

const options = {
	port: 443,
	method: 'GET',
	path: `/search?num=${TOTAL}&q=`,
	hostname: 'www.google.com'
};

module.exports.position = function (domain, term) {
	return new Promise(function(resolve, reject) {
		options.path = options.path + '/' + encodeURIComponent(term);
		Https.request(options, function (res) {
			res.setEncoding('utf8');
			var data = '';

			res.on('error', function (error) {
				reject(error);
			});

			res.on('data', function (chunk) {
				data += chunk;
			});

			res.on('end', function () {
				var domains = [];
				var positions = [];
				var matches = data.match(/(?:<cite.*?>)(.*?)(?:<\/cite>)/g);

				matches = matches.map(function (match, index) {
					return match.replace(/<.*?>/g, '');
				});

				matches.forEach(function (match, index) {
					if (match.indexOf(domain) !== -1) {
						domains.push(match);
						positions.push(index+1);
					}
				});

				resolve({
					total: TOTAL,
					term: term,
					domain: domain,
					domains: domains,
					positions: positions,
					firstDomain: domains[0],
					firstPosition: positions[0]
				});
			});

		}).end();
	});
};

module.exports.toFile = function (path, result) {
	return new Promise(function(resolve, reject) {
		path = Path.extname(path) === '.json' ? path : path + '.json';
		path = Path.isAbsolute(path) ? path : Path.join(process.cwd(), path);
		Fs.writeFile(path, JSON.stringify(result, null, '\t'), function (error) {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		})
	});
}
