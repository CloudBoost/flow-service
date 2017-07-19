const router = require('express').Router();
const PackageJSON = require('../package.json')
const services = require('../services');
const util = require('../util');
const {
	validate
} = util;

module.exports = function () {

	//add edge between 2 nodes in the existinng graph
	// @param  inNode : id of the input Node
	//         outNode : id of the output node
	//         inPort : IN port of the OUTPUT node
	//         outPort : OUT port of the INPUT node
	//         graphId : id of the graph 

	router.put('/graph/edge', function (req, res) {

		let {
			inNode,
			outNode,
			inPort,
			outPort,
			graphId
		} = req.body;
		let data = {
			inNode,
			outNode,
			inPort,
			outPort,
			graphId
		};

		if (validate(inNode, "string"), validate(outNode, "string"), validate(inPort, "string"), validate(outPort, "string"), validate(graphId, "string")) {

			services.edgeService.addEdge(data).then(function (result) {

				console.log("Successfull added edge to node");
				return res.status(200).json(result);

			}, function (error) {

				console.log("Error adding edge to node");
				return res.send(500, error);

			});

		} else
			res.status(400).send('INVALID REQUEST')
	})

	//delete edge form graph
	// @param  graphId : id of the graphId
	//         edgeId : id of the edge in the graphId

	router.delete('/graph/edge', function (req, res) {

		let {
			edgeId,
			graphId
		} = req.body;
		let data = {
			edgeId,
			graphId
		};

		if (validate(edgeId, "string"), validate(graphId, "string")) {

			services.edgeService.deleteEdge(data).then(function (result) {

				console.log("Successfull deleted edge from node");
				return res.status(200).json(result);

			}, function (error) {

				console.log("Error deleteing edge from node");
				return res.send(500, error);

			});

		} else res.status(400).send('INVALID REQUEST')
	})

	return router
}