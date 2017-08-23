var exports = module.exports = {};

exports.validate = function (value, type) {
	if (value === undefined || value === null || value === '') return false
	if (type && type != 'any') {
		if (typeof value != type) return false
	}
	return true
};
exports.generateId = function () {
	var id = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 8; i++) {
		id = id + possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return "r" + id;
};
exports.builtInNpmPackages = [
	'assert',
	'buffer',
	'child_process',
	'cluster',
	'crypto',
	'dgram',
	'dns',
	'domain',
	'events',
	'fs',
	'http',
	'https',
	'net',
	'os',
	'path',
	'punycode',
	'querystring',
	'readline',
	'stream',
	'string_decoder',
	'tls',
	'tty',
	'url',
	'util',
	'v8',
	'vm',
	'zlib'
]
