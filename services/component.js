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
        //          apiId
        addComponent: function (data) {

            console.log("add node service");

            var deferred = Q.defer();

            services.apiService.getApiById(data.apiId).then((api) => { //create a new node

                var Component = require('../node_modules/' + data.name)();
                const id = util.generateId();

                let component = {
                    _id: id,
                    name: data.name,
                    component: Component
                }

                api.components[id] = component;
                api.markModified('components')

                services.apiService.saveApi(api).then((obj) => {

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