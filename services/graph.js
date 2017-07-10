'use strict';

var Q = require('q');
const Graph = require('../models/graph');
const noflo = require('noflo');

module.exports = function() {

    return {

        graphList: function() {

            console.log("Getting graph list..");
            var deferred = Q.defer();

            try {
            Graph.find({},(err,data)=>{
			    if (err) {
                    console.log("Error on getting graphs..");
                    deferred.reject(err);
                }

                if (!data) {
                    console.log("Cannot get the graphs right now.");
                    deferred.reject('Cannot get the graphs right now.');
                } else {
                    console.log("Graph list success");
                    deferred.resolve(data);
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

        createGraph: function(data){

            console.log("create graph service");
            
            var deferred = Q.defer();

            try {
                
                let graph = new Graph()
				//init noflow graph
				graph.graph = noflo.graph.createGraph(data.name)
				graph.description = data.description || null;
				graph.created_on = new Date()
				graph.type = {
					type:data.type.toUpperCase()
				}
                graph.save((err,obj)=>{
			    if (err) {
                    console.log("Error in creating graph..");
                    deferred.reject(err);
                }

                if (!obj) {
                    console.log("Error in creating graph..");
                    deferred.reject('Error in creating graph..');
                } else {
                    console.log("Graph create success");
                    deferred.resolve(obj);
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

        deleteGraph: function(id){

            console.log("create graph service");
            
            var deferred = Q.defer();

            try {
                    
                Graph.remove({_id:id},(err)=>{
                    if (err) {
                        console.log("Error in deleting graph..");
                        deferred.reject(err);
                    }
                    deferred.resolve('Success');
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
        
        addComponent: function(data){

            console.log("add component service");
            
            var deferred = Q.defer();

            try {      

                Graph.findOne({_id:data.graphId},(err,graph)=>{
				try{
                    if (err) {
                        console.log("Error finding graph");
                        deferred.reject(err);
                    }

                    if (!obj) {
                        console.log("Error finding graph");
                        deferred.reject('Error finding graph');
                    } else {

                        let uri = '../node_modules/'+data.pkg+'/components/'+data.name+'.coffee'
                        let comp = require(uri)
                        if(graph.components.length == graph.components.filter(comp => comp.name != data.name).length){
                            graph.components.push({
                                name:data.name,
                                data:comp.getComponent()
                            })
                        }
                        graph.markModified('components')
                        graph.save((err,obj)=>{

                            if (err) {
                                console.log("Error adding component to graph");
                                deferred.reject(err);
                            }

                            if (!obj) {
                                console.log("Error adding component to graph");
                                deferred.reject("Error adding component to graph");
                            } else {
                                console.log("Add component success");
                                deferred.resolve(obj);
                            }

                        })

                    }
                
                } catch(e){
                        res.status(400).send('NO PACKAGE/COMP FOUND')
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

        addNode: function(data){

            console.log("add node service");
            
            var deferred = Q.defer();

            try {
                    
                Graph.findOne({_id:data.graphId},(err,graph)=>{
				try{
                   if (err) {
                        console.log("Error finding graph");
                        deferred.reject(err);
                    }

                    if (!obj) {
                        console.log("Error finding graph");
                        deferred.reject('Error finding graph');
                    } 
                    else{
                        let nodeId = Math.random().toString(36).substring(7)
                        Object.setPrototypeOf(graph.graph,noflo.Graph.prototype)
                        graph.graph.addNode(nodeId,data.name)
                        graph.markModified('graph')
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
					res.status(400).send('NO PACKAGE/COMP FOUND')
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

        addMetadataToNode: function(data){

            console.log("add node service");
            
            var deferred = Q.defer();

            try {
                    
                Graph.findOne({_id:data.graphId},(err,graph)=>{
				try{
                   if (err) {
                        console.log("Error finding graph");
                        deferred.reject(err);
                    }

                    if (!obj) {
                        console.log("Error finding graph");
                        deferred.reject('Error finding graph');
                    } 
                    else{
                        Object.setPrototypeOf(graph.graph,noflo.Graph.prototype)
                        graph.graph.setNodeMetadata(data.nodeId,data.metadata)
                        graph.markModified('graph');
                        graph.save((err,obj)=>{
                            if (err) {
                                console.log("Error adding metadata to node");
                                deferred.reject(err);
                            }

                            if (!obj) {
                                console.log("Error adding  metadata to node");
                                deferred.reject("Error adding  metadata to node");
                            } else {
                                console.log("Add metadata success");
                                deferred.resolve(obj);
                            }                        
                        })
                     }
				} catch(e){
					console.log(e)
					res.status(400).send('NO PACKAGE/COMP FOUND')
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

                    if (!obj) {
                        console.log("Error finding graph");
                        deferred.reject('Error finding graph');
                    } 
                    else{
                        Object.setPrototypeOf(graph.graph,noflo.Graph.prototype)
					    graph.graph.addEdge(data.inNode,data.inPort,data.outNode,data.outPort)
                        graph.markModified('graph');
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
					res.status(400).send('NO PACKAGE/COMP FOUND')
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

                    if (!obj) {
                        console.log("Error finding graph");
                        deferred.reject('Error finding graph');
                    } 
                    else{
                        Object.setPrototypeOf(graph.graph,noflo.Graph.prototype)
    					graph.graph.removeEdge(data.inNode,data.inPort,data.outNode,data.outPort)
                        graph.markModified('graph');
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
					res.status(400).send('NO PACKAGE/COMP FOUND')
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
