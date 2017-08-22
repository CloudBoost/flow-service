'use strict';

var Q = require('q');
const services = require('./index');
const util = require('../util');
const {
    validate
} = util
const Flow = require('../node_modules/cbflow-fs/CloudBoostFlow.js');

module.exports = function () {

    return {

        //add component to the API
        //@param    name: complete path of the component in node_modules
        //          graphId
        addComponent: function (data) {

            console.log("add node service");

            var deferred = Q.defer();

            services.graphService.getGraphById(data.graphId).then((graph) => { //create a new node

                var Component = require('../node_modules/' + data.pkg + '/components/' + data.name)();
                const id = util.generateId();

                let component = {
                    _id: id,
                    name: data.name,
                    data: Component,
                    pkg: data.pkg
                }

                graph.components[id] = component;
                graph.markModified('components')

                services.graphService.saveGraph(graph).then((obj) => {

                    console.log("Add component success");
                    deferred.resolve(obj);

                }, (err) => {

                    console.log("Error adding node to api");
                    deferred.reject(err);

                })

            }, (err) => {

                console.log("Error finding api");
                deferred.reject(err);

            })

            return deferred.promise;

        }

    };

};