const router = require('express').Router();
const PackageJSON = require('../package.json')
const services=require('../services');
const util = require('../util');
const validate = util.validate();

module.exports = function(){

	router.get('/package/all',function(req,res){
		flowPackages = Object.keys(PackageJSON.dependencies).filter( x => x.includes('noflo-') )
		res.status(200).json(flowPackages)
	})

	router.get('/package/info/:name',function(req,res){
		try {
			let packageJSON = require('../node_modules/'+req.params.name+'/package.json')
			if(packageJSON.noflo) res.status(200).json(packageJSON.noflo)
			 else res.status(400).send('INVALID PACKAGE')
		} catch(e){
			res.status(400).send('NO PACKAGE FOUND')
		}
		
	})
	
	return router
}
