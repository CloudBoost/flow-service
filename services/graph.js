'use strict';

var Q = require('q');
const Graph = require('../models/graph');
const services = require('./index');
const vm = require('vm')
const child_process = require('child_process');
const fs = require('fs');
const {
    NodeVM,
    VMScript
} = require('vm2');
const { builtInNpmPackages } = require('../util')
const _ = require('underscore')



module.exports = function () {

    return {

        //get list of all graphs
        /*
        @param :
        */
        graphList: function () {

            console.log("Getting graph list..");

            var deferred = Q.defer();

            Graph.find({}, (err, data) => {

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

            return deferred.promise;
        },

        //create a new graph
        // @param 	name : name of  the graph
        // 			type : type of the graphId
        //			description : desc of the graph
        //			apiId : id of the api to which graph will be attached

        createGraph: function (data) {

            console.log("create graph service");

            var deferred = Q.defer();

            //get the api
            services.apiService.getApiById(data.apiId).then((api) => { //create a new graphh

                let graph = new Graph()
                graph.name = data.name;
                graph.graph = { name: data.name };
                graph.description = data.description;
                graph.type = { type: data.type };

                services.graphService.saveGraph(graph).then((obj) => {

                    api.graphId = obj._id;
                    services.apiService.saveApi(api).then((obj) => {

                        console.log("Graph attach success");
                        deferred.resolve(obj);

                    }, (err) => {

                        console.log("Error in attaching graph to api..");
                        deferred.reject(err);

                    })
                }, (err) => {

                    console.log("Error in creating graph..");
                    deferred.reject('Error in creating graph..');

                })
            }, (err) => {

                global.winston.log('error', {
                    "error": String(err),
                    "stack": new Error().stack
                });
                deferred.reject(err);

            })

            return deferred.promise;

        },

        //delete graph object using id
        // @param id : graphId

        deleteGraph: function (id) {

            console.log("create graph service");

            var deferred = Q.defer();

            Graph.remove({
                _id: id
            }, (err) => {
                if (err) {

                    console.log("Error in deleting graph..");
                    deferred.reject(err);

                }

                deferred.resolve('Success');
            })

            return deferred.promise;

        },

        //execute graph

        executeGraph: function (route, initData) {

            console.log("executes graph service");

            var deferred = Q.defer();

            services.apiService.findOneApi({
                route
            }).then((api) => {

                services.graphService.getGraphById(api.graphId).then((graph) => {
                    try {

                        var socket = require('../node_modules/cbflow-end/components/End.js')().socket;
                        socket.setMaxListeners(99999);
                        var endComponentId = null, startComponentId = null;

                        Object.keys(graph.nodes).forEach((node) => {
                            if (graph.nodes[node].pkg === 'cbflow-end') {
                                endComponentId = graph.nodes[node]._id;
                            }
                            else if (graph.nodes[node].pkg === 'cbflow-start') {
                                startComponentId = graph.nodes[node]._id;
                            }

                        })

                        graph.edges.forEach((edge, i) => {

                            var id = edge.startNode;
                            var packageName = '../node_modules/' + graph.nodes[edge.startNode].pkg + '/components/' + graph.nodes[edge.startNode].name;

                            var c = require(packageName)(socket, id, _.where(graph.edges, { endNode: id }))

                            for (let key in c._inPorts) {
                                socket.on('data-inport-' + id + '-' + key, function (data) {

                                    /*
                                    * to debug uncomment ' socket.emit('execute-' + id, socket);' and comment vm logic;
                                    */

                                    // socket.emit('execute-' + id, socket);
                                    var input = c.input;
                                    var output = c.output;
                                    try {
                                        const vm1 = new NodeVM({
                                            sandbox: {
                                                input,
                                                output
                                            },
                                            require: {
                                                external: true,
                                                builtin: builtInNpmPackages
                                            }
                                        });
                                        const script1 = new VMScript('(' + c.handle.toString() + ')(input,output)');
                                        vm1.run(script1)
                                    } catch (error) {
                                        console.log(error)
                                    }
                                })
                            }

                            var id2 = edge.endNode;


                            if (id2 === endComponentId) {
                                socket.on('result-' + endComponentId, function (data) {
                                    for (let key in socket._events) {
                                        socket.removeAllListeners(key);
                                    }
                                    try {
                                        deferred.resolve({
                                            length: data
                                        })
                                    } catch (error) { }
                                })
                            }


                            var packageName2 = '../node_modules/' + graph.nodes[edge.endNode].pkg + '/components/' + graph.nodes[edge.endNode].name;
                            var c2 = require(packageName2)(socket, id2, _.where(graph.edges, { endNode: id2 }))

                            for (let key in c2._inPorts) {

                                socket.on('data-inport-' + id2 + '-' + key, function (data) {

                                    /*
                                    * to debug uncomment ' socket.emit('execute-' + id2, socket);' and comment vm logic;
                                    */

                                    // socket.emit('execute-' + id2, socket);
                                    var input = c2.input;
                                    var output = c2.output;
                                    try {
                                        const vm2 = new NodeVM({
                                            sandbox: {
                                                input,
                                                output
                                            },
                                            require: {
                                                external: true,
                                                builtin: builtInNpmPackages
                                            }
                                        });
                                        const script2 = new VMScript('(' + c2.handle.toString() + ')(input,output)');
                                        vm2.run(script2)
                                    } catch (error) {
                                        console.log(error)
                                    }
                                })
                            }
                            socket.on('data-outport-' + id + '-' + edge.startPort, function (data) {
                                socket.emit('data-inport-' + id2 + '-' + edge.endPort, data);
                            })
                            //initate graph after all the event listeners are assigned
                            if (i === graph.edges.length - 1) {
                                console.log('1');
                                socket.emit('data-inport-' + startComponentId + '-' + 'in', (initData || 'default value'))
                            }

                        })
                    }
                    catch (err) {
                        console.log("Error while executing api");
                        deferred.reject(err);
                    }
                }, (err) => {

                    console.log("Error in getting graph..");
                    deferred.reject(err);

                })
            }, (err) => {

                console.log("Error in getting api..");
                deferred.reject(err);

            })

            return deferred.promise;
        },

        //save graph
        //params @graph : Graph object

        saveGraph: function (graph) {
            console.log("save graph  service");

            var deferred = Q.defer()

            graph.save((err, obj) => {

                if (err) {

                    console.log("Error in saving graph..");
                    deferred.reject(err);

                }

                if (!obj) {

                    console.log("Error in saving graph ..");
                    deferred.reject('Error in saving graph..');

                } else {

                    console.log("Graph save success");
                    deferred.resolve(obj);

                }
            })

            return deferred.promise;

        },

        //get Graph by id
        //params @id: _id of the graph

        getGraphById: function (id) {

            console.log("get graph by id  service");

            var deferred = Q.defer()

            Graph.findById(id, (err, graph) => {

                if (err) {

                    console.log("Error in getting graph..");
                    deferred.reject(err);

                }

                if (!graph) {

                    console.log("Cannot get the graph right now.");
                    deferred.reject('Cannot get the graph right now.');

                } else {

                    console.log("get graph success");
                    deferred.resolve(graph);

                }
            })

            return deferred.promise;

        }

    };

};