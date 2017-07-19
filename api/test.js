const router = require('express').Router();
const PackageJSON = require('../package.json')
const services = require('../services');
const noflo = require('noflo');
const util = require('../util');
const Graph = require('../models/graph');
const Api = require('../models/api');
const {
	validate
} = util;

module.exports = function () {

	router.get('/test/graph', function (req, res) {
		//init graph
		let graph = noflo.graph.createGraph('test')

		//Add comps
		graph.addNode("Read", "ReadFile")
		graph.addNode("Display", "Output")

		res.json(graph)

		//connect above comps
		graph.addEdge("Read", 'out', 'Display', 'in')

		//send initial data
		graph.addInitial("graph.json", "Read", "in")
		// graph.addInitial("testStrings","Display","in")

		//run
		let network = noflo.createNetwork(graph, function (err, nw) {
			console.log(nw);
			// nw.connect(function(err) {
			// if (err) {
			//   return done(err);
			// }
			// return nw.start();
			// });
		})

	})

	router.post('/test', function (req, res) {
		var component = require('../node_modules/cbflow-fs/components/ReadFile');
		var socket = component.outPorts.out.socket;
		socket.on('data', function (d) {
			res.send(d);
		})
		//	socket.emit('data', 'dd');
		component.execute();
	})

	return router
}