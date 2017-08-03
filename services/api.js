'use strict';

var Q = require('q');
const Api = require('../models/api');
const services = require('./index');
const util = require('../util');

module.exports = function () {

    return {

        //get package info
        // @param   route: route of the api (/a/bc/def)
        //          name: name of the api
        //          description: description of the api

        createApi: function (data) {

            console.log("get package info service");

            var deferred = Q.defer();

            var api = new Api()
            api.name = data.name
            api.description = data.description || 'Awesome API!'
            api.route = data.route||util.generateId();
            api.type=data.type

            this.saveApi(api).then((obj) => {

                console.log("api create success");
                deferred.resolve(obj);

            }, (err) => {

                console.log("Error in creating api..");
                deferred.reject('Error in creating api..');

            })

            return deferred.promise;

        },

        //get Api by id
        //params @id: _id of the api

        getApiById: function (id) {

            console.log("get api by id service");

            var deferred = Q.defer();

            Api.findById(id, (err, api) => {

                if (err) {

                    console.log("Error in getting api..");
                    deferred.reject(err);

                }

                if (!api) {

                    console.log("Cannot get the api right now.");
                    deferred.reject('Cannot get the api right now.');

                } else {

                    console.log("get api success");
                    deferred.resolve(api);

                }

            })

            return deferred.promise;

        },

        //find one api matching query
        //params @query: query of the api

        findOneApi: function (query) {

            console.log("find one api  service");

            var deferred = Q.defer();

            Api.findOne(query, (err, api) => {

                if (err) {

                    console.log("Error in getting api..");
                    deferred.reject(err);

                }

                if (!api) {

                    console.log("Cannot get the api right now.");
                    deferred.reject('Cannot get the api right now.');

                } else {

                    console.log("get api success");
                    deferred.resolve(api);

                }
            })

            return deferred.promise;

        },

        //save api
        //params @document : api object

        saveApi: function (document) {
            console.log("save api  service");

            var deferred = Q.defer();

            document.save((err, obj) => {

                if (err) {

                    console.log("Error in saving api..");
                    deferred.reject(err);

                }

                if (!obj) {

                    console.log("Error in saving api ..");
                    deferred.reject('Error in saving api..');

                } else {

                    console.log("Api save success");
                    deferred.resolve(obj);

                }
            })

            return deferred.promise;

        },

        //get all api
        //params @document : api object

        apiList: function () {
            console.log("getting all apis");

            var deferred = Q.defer();

            Api.find({}, (err, data) => {

                if (err) {

                    console.log("Error on getting apis..");
                    deferred.reject(err);

                }

                if (!data) {

                    console.log("Cannot get the apisgraphs right now.");
                    deferred.reject('Cannot get the apis right now.');

                } else {

                    console.log("Api list success");
                    deferred.resolve(data);

                }
            })


            return deferred.promise;

        },

        //get all api
        //params @document : api object

        updateApi: function (data) {
            console.log("updating api");

            var deferred = Q.defer();

            Api.findByIdAndUpdate(data._id,data,{new:true}, (err, data) => {

                if (err) {

                    console.log("Error on getting apis..");
                    deferred.reject(err);

                }

                if (!data) {

                    console.log("Cannot get the apisgraphs right now.");
                    deferred.reject('Cannot get the apis right now.');

                } else {

                    console.log("Api list success");
                    deferred.resolve(data);

                }
            })


            return deferred.promise;

        },

        //get api by route
        //params @route : route

        getApiByRoute: function (route) {
            console.log("updating api");

            var deferred = Q.defer();

            this.findOneApi({route}).then((api)=>{
                console.log("Get api by route route success")
                deferred.resolve(api);
            }, (err) => {

                console.log("Error in getting api..");
                deferred.reject(err);

            })


            return deferred.promise;

        }

    };

};