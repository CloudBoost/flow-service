const router = require('express').Router();
const PackageJSON = require('../package.json')
const services = require('../services');
const util = require('../util');
const {
    validate
} = util;

module.exports = function () {

    //create new api service
    // @param   route : route of the api
    //          name : name of the api
    //          description : description of the api
    router.post('/create', function (req, res) {

        let {
            route,
            name,
            description,
            type
        } = req.body;

        let data = {
            route,
            name,
            description,
            type
        };

        if (validate(name, "string"), validate(description, "string")) {

            services.apiService.createApi(data).then(function (result) {
                data.apiId = result._id;
                console.log("Attaching graph");
                services.graphService.createGraph(data).then((result) => {
                    console.log("Successfull created api");
                    return res.status(200).json(result);
                }).catch(err => {
                    console.log("Error creating api");
                    return res.send(500, error);
                })
            }, function (error) {

                console.log("Error creating api");
                return res.send(500, error);

            });

        } else {

            res.status(400).send('INVALID REQUEST')

        }
    })

    return router
}