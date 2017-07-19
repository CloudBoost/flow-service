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
		// var component = require('../node_modules/cbflow-fs/components/ReadFile');
		// var component2 = require('../node_modules/cbflow-fs/components/WriteFile');
		// var outsocket = component.outPorts.out.socket;
		// var insocket = component2.inPorts.data.socket;
		Api.findOne({
			route: req.params.route
		}, (err, api) => {
			Graph.findById(api.graphId, (err, graph) => {
				// var component = require('../node_modules/' + api.components[graph.edges[0].outNode].name);
				// //var socket = component.outPorts[graph.edges[0].outPort].socket
				// var s = new Flow.Socket();
				// s.on('result', function (data) {
				// 	console.log('final data', data);
				// })
				// component.execute(s);

				//sandboxing 
				// graph.edges.forEach((edge, i) => {
				// 	const sandbox = {
				// 		data: 'heylo'
				// 	};
				// 	let c = require('../node_modules/' + api.components[edge.inNode].name);
				// 	if (i === 0) {
				// 		//set initial data
				// 		let s = c.inPorts.data.socket;
				// 		s.emit('data', 'hahahahahahah')
				// 	}
				// 	let socket = new Flow.Socket()
				// 	socket.on('result', function (data) {
				// 		c = require('../node_modules/' + api.components[edge.outNode].name);
				// 		c.execute();
				// 	})
				// 	c.execute(socket)
				// })

				var socket = new Flow.Socket();
				socket.setMaxListeners(99999);
				var s2 = socket;
				graph.edges.forEach((edge, i) => {
					// var socket = new Flow.Socket();
					// var id = util.generateId();
					var id = edge.inNode;
					//	if (socket.listenerCount('result-' + id) < 2)
					socket.on('result-' + id, function (data) {
						console.log(data);
					})
					var c = require('../node_modules/' + api.components[edge.inNode].name)(socket, id)

					for (key in c._inPorts) {
						//	if (socket.listenerCount('data-inport-' + id + '-' + key) < 2)
						socket.on('data-inport-' + id + '-' + key, function (data) {
							socket.emit('execute-' + id, socket);
						})
					}

					if (i === 0) {
						//set initial data
						socket.emit('data-inport-' + id + '-' + 'data', '1234567890')
					}
					//2nd component
					// var s2 = new Flow.Socket();
					// var id2 = util.generateId();
					var id2 = edge.outNode;
					//	if (socket.listenerCount('result-' + id2) < 2)
					s2.on('result-' + id2, function (data) {
						if (id2 === graph.edges[graph.edges.length - 1].outNode) {
							try {
								res.status(200).json({
									length: data
								})
							} catch (error) {
								console.log(error)
							}
						}
						console.log(data);
					})
					var c2 = require('../node_modules/' + api.components[edge.outNode].name)(s2, id2)

					for (key in c2._inPorts) {
						//		if (socket.listenerCount('data-inport-' + id2 + '-' + key) < 2)
						s2.on('data-inport-' + id2 + '-' + key, function (data) {
							s2.emit('execute-' + id2, s2);
						})
					}

					//call 2nd component on output at 1st
					//if (socket.listenerCount('data-outport-' + id + '-' + edge.outPort) < 2)
					socket.on('data-outport-' + id + '-' + edge.outPort, function (data) {
						s2.emit('data-inport-' + id2 + '-' + edge.inPort, data);
					})

				})

				//sandboxing ends

			})
		})

	})

	return router
}