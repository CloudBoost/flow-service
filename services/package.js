'use strict';

var Q = require('q');
const Graph = require('../models/graph');
const services = require('./index');
const fs = require('fs')
const path = require('path')
const PackageJSON = require('../package.json')

module.exports = function () {

    return {

        //get list of all cbflow packages
        getPackageList: function () {
            console.log("get package list service")

            var deferred = Q.defer();

            var flowPackages = {}

            try {

                flowPackages = Object.keys(PackageJSON.dependencies).filter(x => x.includes('cbflow-'))
                deferred.resolve(flowPackages);

            } catch (err) {
                global.winston.log('error', {
                    "error": String(err),
                    "stack": new Error().stack
                });
                deferred.reject(err);
            }
            return deferred.promise;

        },
        //get package info
        // @param  name : name of the package

        getPackageInfo: function (name) {

            console.log("get package info service");


            var deferred = Q.defer();

            try {

                fs.readdir('./node_modules/' + name + '/components', (err, files) => {
                    //filter js files
                    if (err) {
                        deferred.reject(err);
                    }
                    if (files) {
                        var components = files.filter((element) => {
                            var extName = path.extname(element);
                            return extName === '.js';
                        })

                        deferred.resolve(components);
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