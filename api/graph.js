const router = require('express').Router();
const PackageJSON = require('../package.json')
const services=require('../services');
const util = require('../util');
const {validate} = util;

module.exports = function(){

	//get list of all graphs
	/*
	@param :
	*/
	router.get('/graph/all',function(req,res){
	
		services.graphService.graphList().then(function(result) {
				console.log("Successfull Get Graphs");
				return res.status(200).json(result);
        }, function(error) {
				console.log("Error getting graph list");
				return res.send(500, error);
        });

	})

	//create a new graph
	// @param 	name : name of  the graph
	// 			type : type of the graphId
	//			description : desc of the graph

	router.post('/graph',function(req,res){

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

	//delete graph object using id
	// @param id : graphId

	router.delete('/graph',function(req,res){

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

	return router
}
