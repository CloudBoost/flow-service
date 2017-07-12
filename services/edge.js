'use strict';

var Q = require('q');
const Graph = require('../models/graph');
const services = require('./index');

module.exports = function() {

    return {

        //add edge between 2 nodes in the existinng graph
        // @param  inNode : id of the input Node
        //         outNode : id of the output node
        //         inPort : IN port of the OUTPUT node
        //         outPort : OUT port of the INPUT node
        //         graphId : id of the graph 

        addEdge: function(data){

            console.log("add edge service");

            
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
                        let {inNode,outNode,inPort,outPort} = data;

                        graph.edges.push({
                            inNode,//id
                            outNode,//id
                            inPort,//string
                            outPort,//string
                            _id:util.generateId()
                        })
                        graph.markModified('edges');
                        graph.save((err,obj)=>{
                            if (err) {
                                console.log("Error adding edge to node");
                                deferred.reject(err);
                            }

                            if (!obj) {
                                console.log("Error adding edge to node");
                                deferred.reject("Error adding edge to node");
                            } else {
                                console.log("Add edge success");
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

        },

        //delete edge form graph
        // @param  graphId : id of the graphId
        //         edgeId : id of the edge in the graphId

        deleteEdge: function(data){

            console.log("delete edge service");
            
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
                        graph.edges=graph.edges.filter((edge)=>edge._id!==data.edgeId)
                        graph.markModified('edges');
                        graph.save((err,obj)=>{
                            if (err) {
                                console.log("Error deleting edge from node");
                                deferred.reject(err);
                            }

                            if (!obj) {
                                console.log("Error deleting edge from node");
                                deferred.reject("Error deleting edge from  node");
                            } else {
                                console.log("Delete edge success");
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
