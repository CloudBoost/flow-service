const router = require('express').Router();
const PackageJSON = require('../package.json')
const services = require('../services');
const util = require('../util');
const {
	validate
} = util;

module.exports = function () {

	//add edge between 2 nodes in the existinng graph
	// @param  startNode : id of the start Node
	//         endNode : id of the end node
	//         endPort : IN port of the end node
	//         startPort : OUT port of the start node
	//         graphId : id of the graph 

	router.put('/graph/edge', function (req, res) {

		let {
			startNode,
			endNode,
			endPort,
			startPort,
			graphId,endi,starti,x1,x2,y1,y2
		} = req.body;

		let data = {
			startNode,
			endNode,
			endPort,
			startPort,
			graphId,endi,starti,x1,x2,y1,y2
		};

		if (validate(startNode, "string"), validate(endNode, "string"), validate(startPort, "string"), validate(endPort, "string"), validate(graphId, "string")) {

			services.edgeService.addEdge(data).then(function (result) {

				console.log("Successfull added edge to node");
				return res.status(200).json(result);

			}, function (error) {

				console.log("Error adding edge to node");
				return res.send(500, error);

			});

		} else {

			res.status(400).send('INVALID REQUEST')

		}
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

		} else {

			res.status(400).send('INVALID REQUEST')

		}
	})

	return router
}