'use strict';

var Q = require('q');
const Graph = require('../models/graph');
const services = require('./index');
const util = require('../util');
const {
    validate
} = util

module.exports = function () {

    return {

        //add node to existing graph
        // @param  name : name of the node which will be displayed on the UI (eg. Add1, Add2)
        //         graphId : id of the graph
        //         component : id of the component object 
        //         metadata : metadata of the node (eg: x,y coordinates)

        addNode: function (data) {

            console.log("add node service");

            var deferred = Q.defer();

            try {

                Graph.findOne({
                    _id: data.graphId
                }, (err, graph) => {
                    try {
                        if (err) {
                            console.log("Error finding graph");
                            deferred.reject(err);
                        }

                        if (!graph) {
                            console.log("Error finding graph");
                            deferred.reject('Error finding graph');
                        } else {

                            //create a new node
                            let node = {
                                _id: util.generateId(),
                                name: data.name,
                                component: data.componentId,
                                metadata: data.metadata
                            }
                            graph.nodes.push(node);
                            graph.markModified('nodes')
                            graph.save((err, obj) => {
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
                    } catch (e) {
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

        //add metadata to existing node
        // @param  graphId : id of the graph
        //         metadata : metadata of the node (eg: x,y coordinates)
        //         nodeId : id of the node in the graph

        addMetadataToNode: function (data) {

            console.log("add node service");

            var deferred = Q.defer();

            try {

                Graph.findOne({
                    _id: data.graphId
                }, (err, graph) => {
                    try {
                        if (err) {
                            console.log("Error finding graph");
                            deferred.reject(err);
                        }

                        if (!graph) {
                            console.log("Error finding graph");
                            deferred.reject('Error finding graph');
                        } else {
                            //fetch node and add metadat
                            graph.nodes.forEach((node) => {
                                if (node._id === data.nodeId) {
                                    node.metadata = data.metadata;
                                }
                            })
                            graph.markModified('nodes');
                            graph.save((err, obj) => {
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
                    } catch (e) {
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