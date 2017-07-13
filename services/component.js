'use strict';

var Q = require('q');
const Graph = require('../models/graph');
const services = require('./index');

module.exports = function() {

    return {
        
        //TODO:
        addComponent: function(data){

            console.log("add node service");
            
            var deferred = Q.defer();

            try {
                    
                Graph.findOne({_id:data.graphId},(err,graph)=>{
				try{
                   if (err) {
                        console.log("Error finding graph");
                        deferred.reject(err);
                    }

                    if (!graph) {
                        console.log("Error finding graph");
                        deferred.reject('Error finding graph');
                    } 
                    else{

                        //create a new node
                            let node = {
                                _id:util.generateId(),
                                name:data.name,
                                component:data.component //id
                            }
                            graph.nodes.push(node);
                            graph.markModified('nodes')
                            graph.save((err,obj)=>{
                            if (err) {
                                console.log("Error adding node to graph");
                                deferred.reject(err);
                            }

                            if (!obj) {
                                console.log("Error adding node to graph");
                                deferred.reject("Error adding node to graph");
                            } else {
                                console.log("Add node success");
                                deferred.resolve(obj);
                            }                        
                        })
                        
                        
                     }
				} catch(e){
					console.log(e)
					deferred.reject("NO Packagae/Comp found");
				}
			})

            } catch (err) {
                global.winston.log('error', {
                    "error": String(err),
                    "stack": new Error().stack
                });
                deferred.reject(err);
            }

            return deferred.promise;

        }

    };

};
