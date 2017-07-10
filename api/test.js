const router = require('express').Router();
const PackageJSON = require('../package.json')
const services=require('../services');
const util = require('../util');
const validate = util.validate();

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
		graph.addInitial("models/graph.js","Read","in")
		// graph.addInitial("testStrings","Display","in")

		//run
		let network = noflo.createNetwork(graph,function(err,nw){
			// nw.connect(function(err) {
	          // if (err) {
	          //   return done(err);
	          // }
	          // return nw.start();
	        // });
		})
		
	})

	router.get('/test/node',function(req,res){
		let uri = '../node_modules/noflo-core/components/Copy.coffee'
		let comp = require(uri)
		res.json(comp.getComponent())
	})

	return router
}
