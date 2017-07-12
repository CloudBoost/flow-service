const router = require('express').Router();
const PackageJSON = require('../package.json')
const services=require('../services');
const noflo = require('noflo');
const util = require('../util');
const {validate} = util;

module.exports = function(){

	router.get('/test/graph',function(req,res){
		//init graph
		let graph = noflo.graph.createGraph('test')

		//Add comps
		graph.addNode("Read","ReadFile")
		graph.addNode("Display","Output")

		res.json(graph)

		//connect above comps
		graph.addEdge("Read",'out','Display','in')

		//send initial data
		graph.addInitial("graph.json","Read","in")
		// graph.addInitial("testStrings","Display","in")

		//run
		let network = noflo.createNetwork(graph,function(err,nw){
			console.log(nw);
			// nw.connect(function(err) {
	          // if (err) {
	          //   return done(err);
	          // }
	          // return nw.start();
	        // });
		})
		
	})

	router.get('/test/json',function(req,res){
		var noflo = require("noflo");
		noflo.loadFile(__dirname+"\\graph.json", function(err, network) {
		if (err) {
			throw err;
		}
		console.log("Graph loaded");
		console.log(network.graph.toDOT());
		res.send();
		});
	})

	router.get('/test/node',function(req,res){
		let uri = '../node_modules/noflo-core/components/Copy.coffee'
		let comp = require(uri)
		res.json(comp.getComponent())
	})

	return router
}
