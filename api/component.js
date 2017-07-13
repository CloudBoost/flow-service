const router = require('express').Router();
const PackageJSON = require('../package.json')
const services=require('../services');
const util = require('../util');
const {validate} = util

module.exports = function(){

	//TODO : discuss again
	//add component to existing graph
	// @param 
	router.put('/component',function(req,res){

		let {name,graphId,pkg} = req.body;
		let data = {name,graphId,pkg}
		if(validate(name,"string"),validate(graphId,"string"),validate(pkg,"string")){
			services.componentService.addComponent(data).then(function(result) {

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
	
	return router
}
