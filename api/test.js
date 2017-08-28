const router = require('express').Router();
const PackageJSON = require('../package.json')
const services = require('../services');
const noflo = require('noflo');
const Graph = require('../models/graph');
const Api = require('../models/api');
const child_process = require('child_process');

module.exports = function () {

	router.post('/test', function (req, res) {

		var child = child_process.fork('./executables/child.js');
		child.on('message', (d) => {
			res.send(d);
		})
	})

	return router
}