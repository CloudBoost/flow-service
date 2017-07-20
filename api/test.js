const router = require('express').Router();
const PackageJSON = require('../package.json')
const services = require('../services');
const noflo = require('noflo');
const util = require('../util');
const Graph = require('../models/graph');
const Api = require('../models/api');
const {
	validate,
	generateId
} = util;

const Flow = require('../node_modules/cbflow-fs/CloudBoostFlow.js');

module.exports = function () {

	router.post('/test/:route', function (req, res) {

		services.graphService.executeGraph(req.params.route).then(function (result) {

			console.log("graph executed successfully ");
			return res.status(200).json(result);

		}, function (error) {

			console.log("Error executing graph");
			return res.status(500).send(error);

		});
	})

	return router
}