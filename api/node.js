const router = require('express').Router();
const PackageJSON = require('../package.json')
const services = require('../services');
const util = require('../util');
const {
	validate
} = util;

module.exports = function () {

	//add node to existing graph
	// @param  name : name of the node which will be displayed on the UI (eg. Add1, Add2)
	//         graphId : id of the graph
	//         component : id of the component object 
	//         metadata : metadata of the node (eg: x,y coordinates)

	router.put('/graph/node', function (req, res) {

		let {
			name,
			graphId,
			componentId
		} = req.body;
		let data = {
			name,
			graphId,
			componentId
		}

		if (validate(name, "string"), validate(graphId, "string")) {

			services.nodeService.addNode(data).then(function (result) {

				console.log("Successfull added node to  Graph");
				return res.status(200).json(result);

			}, function (error) {

				console.log("Error adding node to graph ");
				return res.send(500, error);

			});

		} else
			res.status(400).send('INVALID REQUEST')
	})

	//add metadata to existing node
	// @param  graphId : id of the graph
	//         metadata : metadata of the node (eg: x,y coordinates)
	//         nodeId : id of the node in the graph

	router.put('/graph/node/metadata', function (req, res) {

		//add metdata to node
		let {
			graphId,
			nodeId,
			metadata
		} = req.body;
		let data = {
			graphId,
			nodeId,
			metadata
		};

		if (validate(nodeId, "string"), validate(graphId, "string"), validate(metadata, "object")) {

			services.nodeService.addMetadataToNode(data).then(function (result) {

				console.log("Successfull added metadata to node");
				return res.status(200).json(result);

			}, function (error) {

				console.log("Error adding metadata to node");
				return res.send(500, error);

			});

		} else
			res.status(400).send('INVALID REQUEST')
	})

	return router
}