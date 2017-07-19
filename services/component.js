'use strict';

var Q = require('q');
const Graph = require('../models/graph');
const Api = require('../models/api');
const Component = require('../models/component');
const services = require('./index');
const util = require('../util');
const {
    validate
} = util

module.exports = function () {

    return {

        //add component to the API
        //@param    name: complete path of the component in node_modules
        //          apiId
        addComponent: function (data) {

            console.log("add node service");

            var deferred = Q.defer();

            try {

                Api.findById(data.apiId, (err, api) => {
                    try {
                        if (err) {
                            console.log("Error finding api");
                            deferred.reject(err);
                        }

                        if (!api) {
                            console.log("Error finding api");
                            deferred.reject('Error finding api');
                        } else {

                            //create a new node
                            var Component = require('../node_modules/' + data.name);
                            const id = util.generateId();
                            let component = {
                                _id: id,
                                name: data.name,
                                component: Component
                            }

                            api.components[id] = component;
                            api.markModified('components')
                            api.save((err, obj) => {
                                if (err) {
                                    console.log("Error adding node to api");
                                    deferred.reject(err);
                                }

                                if (!obj) {
                                    console.log("Error adding node to api");
                                    deferred.reject("Error adding node to api");
                                } else {
                                    console.log("Add component success");
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