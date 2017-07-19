'use strict';

var Q = require('q');
const Graph = require('../models/graph');
const Api = require('../models/api');
const services = require('./index');

module.exports = function () {

    return {

        //get list of all graphs
        /*
        @param :
        */
        graphList: function () {

            console.log("Getting graph list..");
            var deferred = Q.defer();

            try {
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

            } catch (err) {
                global.winston.log('error', {
                    "error": String(err),
                    "stack": new Error().stack
                });
                deferred.reject(err);
            }

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

            try {
                //get the api
                Api.findById(data.apiId, (err, api) => {

                    //create a new graphh
                    let graph = new Graph()
                    graph.name = data.name;
                    graph.description = data.description;
                    graph.save((err, obj) => {
                        if (err) {
                            console.log("Error in creating graph..");
                            deferred.reject(err);
                        }

                        if (!obj) {
                            console.log("Error in creating graph..");
                            deferred.reject('Error in creating graph..');
                        } else {
                            //attach graph to api
                            api.graphId = obj._id;
                            api.save((err, obj) => {
                                if (err) {
                                    console.log("Error in attaching graph to api..");
                                    deferred.reject(err);
                                }

                                if (!obj) {
                                    console.log("Error in attaching graph to api..");
                                    deferred.reject('Error in attaching graph to api..');
                                } else {
                                    console.log("Graph attach success");
                                    deferred.resolve(obj);

                                }
                            })
                        }
                    })
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

        //delete graph object using id
        // @param id : graphId

        deleteGraph: function (id) {

            console.log("create graph service");

            var deferred = Q.defer();

            try {

                Graph.remove({
                    _id: id
                }, (err) => {
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

        }

    };

};