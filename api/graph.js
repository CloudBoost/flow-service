const router = require('express').Router();
const PackageJSON = require('../package.json')
const services=require('../services');
const util = require('../util');
const {validate} = util;

module.exports = function(){

	router.get('/status',function(req,res){

		//status api

		res.status(200).send('OkK')
	})

	router.get('/graph/all',function(req,res){
		
		//get list of all graphs

		services.graphService.graphList().then(function(result) {
				console.log("Successfull Get Graphs");
				return res.status(200).json(result);
        }, function(error) {
				console.log("Error getting graph list");
				return res.send(500, error);
        });

	})

	router.post('/graph',function(req,res){

		//create a new graph

		let {name,type,description} = req.body;
		let data={name,type,description};

		if(validate(name,"string"),validate(type,"string")){

			services.graphService.createGraph(data).then(function(result) {

				console.log("Successfull Create Graph");
				return res.status(200).json(result);
        
			},function(error) {
		
				console.log("Error creating graph ");
				return res.send(500, error);
		
			});
		} 
		
		else 
				res.status(400).send('INVALID REQUEST')
	})

	router.delete('/graph',function(req,res){

		//delete graph object using id

		let {id} = req.body;
		if(validate(id,"string")){

			services.graphService.deleteGraph(id).then(function(result) {

				console.log("Successfull deleted Graph");
				return res.status(200).json(result);
        
			},function(error) {
		
				console.log("Error deleting graph ");
				return res.send(500, error);
		
			});

		} 
		else 
			res.status(400).send('INVALID REQUEST')
	})

	router.put('/graph/component',function(req,res){

		//add component to existing graph

		let {name,graphId,pkg} = req.body;
		let data = {name,graphId,pkg}
		if(validate(name,"string"),validate(graphId,"string"),validate(pkg,"string")){
			services.graphService.addComponent(data).then(function(result) {

				console.log("Successfull added component to  Graph");
				return res.status(200).json(result);
        
			},function(error) {
		
				console.log("Error adding component to graph ");
				return res.send(500, error);
		
			});
		}
		else 
			res.status(400).send('INVALID REQUEST')
	})

	router.put('/graph/node',function(req,res){

		//add node to existing graph
		let {name,graphId} = req.body;
		let data = {name,graphId}

		if(validate(name,"string"),validate(graphId,"string")){

			services.graphService.addNode(data).then(function(result) {

				console.log("Successfull added node to  Graph");
				return res.status(200).json(result);
        
			},function(error) {
		
				console.log("Error adding node to graph ");
				return res.send(500, error);
		
			});

		} 
		else
			res.status(400).send('INVALID REQUEST')
	})

	router.put('/graph/node/metadata',function(req,res){
	
		//add metdata to node
		let {graphId,nodeId,metadata} = req.body;
		let data =  {graphId,nodeId,metadata};

		if(validate(nodeId,"string"),validate(graphId,"string"),validate(metadata,"object")){
			
			services.graphService.addMetadataToNode(data).then(function(result) {

				console.log("Successfull added metadata to node");
				return res.status(200).json(result);
        
			},function(error) {
		
				console.log("Error adding metadata to node");
				return res.send(500, error);
		
			});

		} 
		else 
			res.status(400).send('INVALID REQUEST')
	})

	router.put('/graph/edge',function(req,res){

		//add edge to graph
		let {inNode,outNode,inPort,outPort,graphId} = req.body;
		let data =  {inNode,outNode,inPort,outPort,graphId};

		if(validate(inNode,"string"),validate(outNode,"string"),validate(inPort,"string"),validate(outPort,"string"),validate(graphId,"string")){
			
			services.graphService.addEdge(data).then(function(result) {

				console.log("Successfull added edge to node");
				return res.status(200).json(result);
        
			},function(error) {
		
				console.log("Error adding edge to node");
				return res.send(500, error);
		
			});

		} 
		else 
			res.status(400).send('INVALID REQUEST')
	})

	router.delete('/graph/edge',function(req,res){

		//delete edge form graph
		let {inNode,outNode,inPort,outPort,graphId} = req.body;
		let data =  {inNode,outNode,inPort,outPort,graphId};

		if(validate(inNode,"string"),validate(outNode,"string"),validate(inPort,"string"),validate(outPort,"string"),validate(graphId,"string")){
			
			services.graphService.deleteEdge(data).then(function(result) {

				console.log("Successfull deleted edge from node");
				return res.status(200).json(result);
        
			},function(error) {
		
				console.log("Error deleteing edge from node");
				return res.send(500, error);
		
			});

		} else res.status(400).send('INVALID REQUEST')
	})

	return router
}
