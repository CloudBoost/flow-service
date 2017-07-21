const router = require('express').Router();
const PackageJSON = require('../package.json')
const services = require('../services');
const noflo = require('noflo');
const Graph = require('../models/graph');
const Api = require('../models/api');
const Flow = require('../node_modules/cbflow-fs/CloudBoostFlow.js');


module.exports = function () {

	router.post('/test', function (req, res) {
		var util = require('util');
		var vm = require('vm');
		var sandbox = {
			e: null
		};
		var src = 'try{count += 1;}catch(err) {e=err.stack}';

		vm.runInNewContext(src, sandbox, {
			filename: 'myfile.vm',
			displayErrors: true
		});
		console.log(util.inspect(sandbox));
	})

	return router
}