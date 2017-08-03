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
                graph.graph={name:data.name};
                graph.description = data.description;
                graph.type={type:data.type};

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
                    try{

                    var socket = require('../node_modules/cbflow-end/components/End.js')().socket;
                    socket.setMaxListeners(99999);

                    graph.edges.forEach((edge, i) => {

                        var id = edge.startNode;
                        var packageName = '../node_modules/' + graph.nodes[edge.startNode].pkg+'/components/'+graph.nodes[edge.startNode].name;
                        var c = require(packageName)(socket, id)

                        for (let key in c._inPorts) {
                            socket.on('data-inport-' + id + '-' + key, function (data) {
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
                                            builtin: ['assert',
                                                'buffer',
                                                'child_process',
                                                'cluster',
                                                'crypto',
                                                'dgram',
                                                'dns',
                                                'domain',
                                                'events',
                                                'fs',
                                                'http',
                                                'https',
                                                'net',
                                                'os',
                                                'path',
                                                'punycode',
                                                'querystring',
                                                'readline',
                                                'stream',
                                                'string_decoder',
                                                'tls',
                                                'tty',
                                                'url',
                                                'util',
                                                'v8',
                                                'vm',
                                                'zlib'
                                            ]
                                        }
                                    });
                                    const script1 = new VMScript('(' + c.handle.toString() + ')(input,output)');
                                    vm1.run(script1)
                                } catch (error) {
                                    console.log(error)
                                }
                                // trycomponent
                                // console.time('vm')
                                // try {
                                //     const script = new vm.Script('(' + c.handle.toString() + ')(input,output)');
                                //     const context = new vm.createContext({
                                //         console,
                                //         require,
                                //         input,
                                //         output,
                                //         socket
                                //     });
                                //     script.runInNewContext(context);
                                // } catch (error) {
                                //     deferred.reject(error.stack)
                                // }
                                // console.timeEnd('vm')
                                // try {
                                //     fs.mkdir('./executables', (err, fd) => {
                                //         fs.writeFile('./executables/' + id + '.js', "console.log('saasasa');process.on('message',(data)=>{console.log('1');var component= require(data.packageName)();var socket=data.socket;socket.__proto__=component._socket.__proto__;var input=data.input;input.__proto__=component._input.__proto__;var output=data.output;output.__proto__=component._output.__proto__;" + '(' + c.handle.toString() + ')(input,output)' + "});", 'utf8', (err) => {
                                //             console.log(err);
                                //             var child = child_process.fork('./executables/' + id + '.js');
                                //             child.send({
                                //                 packageName,
                                //                 input,
                                //                 output,
                                //                 socket
                                //             });
                                //             child.on('message', (data) => {
                                //                 for (key in data) {
                                //                     socket.emit('data-outport-' + id + '-' + key, data[key]);
                                //                     output.done();
                                //                 }
                                //             })
                                //         })
                                //     })
                                // } catch (error) {
                                //     console.log(error);
                                // }

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
                        var packageName2 = '../node_modules/' + graph.nodes[edge.endNode].pkg+'/components/'+graph.nodes[edge.endNode].name;
                        var c2 = require(packageName2)(socket, id2)

                        for (let key in c2._inPorts) {

                            socket.on('data-inport-' + id2 + '-' + key, function (data) {
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
                                            builtin: ['assert',
                                                'buffer',
                                                'child_process',
                                                'cluster',
                                                'crypto',
                                                'dgram',
                                                'dns',
                                                'domain',
                                                'events',
                                                'fs',
                                                'http',
                                                'https',
                                                'net',
                                                'os',
                                                'path',
                                                'punycode',
                                                'querystring',
                                                'readline',
                                                'stream',
                                                'string_decoder',
                                                'tls',
                                                'tty',
                                                'url',
                                                'util',
                                                'v8',
                                                'vm',
                                                'zlib'
                                            ]
                                        }
                                    });
                                    const script2 = new VMScript('(' + c2.handle.toString() + ')(input,output)');
                                    vm2.run(script2)
                                } catch (error) {
                                    console.log(error)
                                }
                                // console.time('vm')
                                // try {
                                //     const script = new vm.Script('(' + c2.handle.toString() + ')(input,output)');
                                //     const context = new vm.createContext({
                                //         require,
                                //         console,
                                //         input,
                                //         output,
                                //         socket
                                //     });
                                //     script.runInNewContext(context);

                                // } catch (error) {
                                //     deferred.reject(error)
                                // }


                                // try {
                                //     fs.mkdir('./executables', (err, fd) => {
                                //         fs.writeFile('./executables/' + id2 + '.js', "console.log('asasa');process.on('message',(data)=>{console.log('1');if(!data.packageName2){return;} console.log(data.packageName2);var component= require(data.packageName2)();var socket=data.socket;socket.__proto__=component._socket.__proto__;var input=data.input;input.__proto__=component._input.__proto__;var output=data.output;output.__proto__=component._output.__proto__;" + '(' + c2.handle.toString() + ')(input,output)' + ";});", 'utf8', (err) => {
                                //             console.log(err);
                                //             var child = child_process.fork('./executables/' + id2 + '.js');
                                //             child.send({
                                //                 packageName2,
                                //                 input,
                                //                 output,
                                //                 socket
                                //             });
                                //             child.on('message', (data) => {
                                //                 for (key in data) {
                                //                     socket.emit('data-outport-' + id2 + '-' + key, data[key]);
                                //                     output.done();

                                //                 }
                                //             })
                                //         })
                                //     })
                                // } catch (error) {
                                //     console.log(err)
                                // }

                            })
                        }
                        socket.on('data-outport-' + id + '-' + edge.startPort, function (data) {
                            socket.emit('data-inport-' + id2 + '-' + edge.endPort, data);
                        })

                    })
                }
                catch(err){
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