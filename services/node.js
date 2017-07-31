'use strict';

var Q = require('q');
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

            services.graphService.getGraphById(data.graphId).then((graph) => {
                //create a new node

                let node = {
                    _id: util.generateId(),
                    name: data.name,
                    component: data.componentId,
                    metadata: data.metadata,pkg:data.pkg
                }
                graph.nodes[node._id] = node;
                graph.markModified('nodes')

                services.graphService.saveGraph(graph).then((obj) => {

                    console.log("Add node success");
                    deferred.resolve(obj);

                }, (err) => {

                    console.log("Error adding node to graph");
                    deferred.reject(err);

                })
            }, (err) => {

                console.log("Error finding graph");
                deferred.reject(err);

            })


            return deferred.promise;

        },

        //add metadata to existing node
        // @param  graphId : id of the graph
        //         metadata : metadata of the node (eg: x,y coordinates)
        //         nodeId : id of the node in the graph

        addMetadataToNode: function (data) {

            console.log("add node service");

            var deferred = Q.defer();

            services.graphService.getGraphById(data.graphId).then((graph) => { //fetch node and add metadat

                graph.nodes[data.nodeId].metadata = data.metadata;
                graph.markModified('nodes');

                services.graphService.saveGraph(graph).then((obj) => {

                    console.log("Add metadata success");
                    deferred.resolve(obj);

                }, (err) => {

                    console.log("Error adding metadata to node");
                    deferred.reject(err);

                })
            }, (err) => {

                console.log("Error finding graph");
                deferred.reject(err);

            })


            return deferred.promise;

        }

    };

};