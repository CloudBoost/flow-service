'use strict';

var Q = require('q');
const services = require('./index');
const util = require('../util');
const {
    validate
} = util

module.exports = function () {

    return {

        //add edge between 2 nodes in the existinng graph
        // @param  startNode : id of the start Node
        //         endNode : id of the end node
        //         endPort : IN port of the end node
        //         startPort : OUT port of the start node
        //         graphId : id of the graph 

        addEdge: function (data) {

            console.log("add edge service");

            var deferred = Q.defer();

            services.graphService.getGraphById(data.graphId).then((graph) => {

                let {
                    startNode,
                    endNode,
                    endPort,
                    startPort,
                } = data;

                graph.edges.push({
                    startNode,
                    endNode,
                    endPort,
                    startPort,
                    _id: startNode+startPort+endNode+endPort
                })
                graph.markModified('edges');

                services.graphService.saveGraph(graph).then((obj) => {

                    console.log("Add edge success");
                    deferred.resolve(obj);

                }, (err) => {

                    console.log("Error adding edge to node");
                    deferred.reject("Error adding edge to node");

                })
            }, (err) => {

                console.log("Error finding graph");
                deferred.reject(err);

            })

            return deferred.promise;

        },

        //delete edge form graph
        // @param  graphId : id of the graphId
        //         edgeId : id of the edge in the graphId

        deleteEdge: function (data) {

            console.log("delete edge service");

            var deferred = Q.defer();

            services.graphService.getGraphById(data.graphId).then((graph) => {

                let filteredEdges = graph.edges.filter((edge) => {
                    return edge._id !== data.edgeId
                })
                graph.edges=filteredEdges
                graph.markModified('edges');

                services.graphService.saveGraph(graph).then((obj) => {

                    console.log("Delete edge success");
                    deferred.resolve(obj);

                }, (err) => {

                    console.log("Error deleting edge to node");
                    deferred.reject("Error deleting edge to node");

                })
            }, (err) => {

                console.log("Error finding graph");
                deferred.reject(err);

            })


            return deferred.promise;

        }

    };

};