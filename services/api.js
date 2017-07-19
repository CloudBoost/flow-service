'use strict';

var Q = require('q');
const Graph = require('../models/graph');
const Api = require('../models/api');
const services = require('./index');

module.exports = function () {

    return {

        //get package info
        // @param   route: route of the api (/a/bc/def)
        //          name: name of the api
        //          description: description of the api

        createApi: function (data) {

            console.log("get package info service");


            var deferred = Q.defer();

            try {

                var api = new Api()
                api.name = data.name
                api.description = data.description || 'Awesome API!'
                api.route = data.route
                api.save((err, obj) => {
                    if (err) {
                        console.log("Error in creating api..");
                        deferred.reject(err);
                    }

                    if (!obj) {
                        console.log("Error in creating api..");
                        deferred.reject('Error in creating api..');
                    } else {
                        console.log("api create success");
                        deferred.resolve(obj);
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