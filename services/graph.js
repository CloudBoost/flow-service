'use strict';

var Q = require('q');
const Graph = require('../models/graph');
const services = require('./index');
const vm = require('vm')

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
                graph.description = data.description;

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

        executeGraph: function (route) {

            console.log("executes graph service");

            var deferred = Q.defer();

            services.apiService.findOneApi({
                route
            }).then((api) => {

                services.graphService.getGraphById(api.graphId).then((graph) => {

                    var socket = require('../node_modules/cbflow-fs/components/End.js')().socket;
                    socket.setMaxListeners(99999);

                    graph.edges.forEach((edge, i) => {

                        var id = edge.startNode;
                        var c = require('../node_modules/' + graph.nodes[edge.startNode].path)(socket, id)

                        for (let key in c._inPorts) {
                            socket.on('data-inport-' + id + '-' + key, function (data) {
                                // socket.emit('execute-' + id, socket);
                                var input = c.input;
                                var output = c.output;
                                console.time('vm')
                                try {
                                    vm.runInNewContext('(' + c.handle.toString() + ')(input,output)', {
                                        require,
                                        console,
                                        input,
                                        output,
                                        socket
                                    });
                                } catch (error) {
                                    deferred.reject(error.stack)
                                }
                                console.timeEnd('vm')
                            })
                        }

                        if (i === 0) {
                            socket.emit('data-inport-' + id + '-' + 'data', '1234567890')
                        }

                        var id2 = edge.endNode;

                        if (id2 === graph.edges[graph.edges.length - 1].endNode) {

                            socket.on('result-' + id2, function (data) {
                                for (let key in socket._events) {
                                    socket.removeAllListeners(key);
                                }
                                try {
                                    deferred.resolve({
                                        length: data
                                    })
                                } catch (error) {}
                            })
                        }
                        var c2 = require('../node_modules/' + graph.nodes[edge.endNode].path)(socket, id2)

                        for (let key in c2._inPorts) {

                            socket.on('data-inport-' + id2 + '-' + key, function (data) {
                                // socket.emit('execute-' + id2, socket);
                                var input = c2.input;
                                var output = c2.output;
                                console.time('vm')
                                try {
                                    vm.runInNewContext('(' + c2.handle.toString() + ')(input,output)', {
                                        require,
                                        console,
                                        input,
                                        output,
                                        socket
                                    });
                                } catch (error) {
                                    deferred.reject(error)
                                }

                            })
                        }
                        socket.on('data-outport-' + id + '-' + edge.startPort, function (data) {
                            socket.emit('data-inport-' + id2 + '-' + edge.endPort, data);
                        })

                    })
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