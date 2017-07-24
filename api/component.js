const router = require('express').Router();
const PackageJSON = require('../package.json')
const services = require('../services');
const util = require('../util');
const {
	validate
} = util

module.exports = function () {

	//TODO : discuss again
	//add component to existing graph
	// @param pkg = name of the package (cbflow-fs)
	// @param name = name of the component (ReadFile)
	// @param graphId = id of the graph

	router.put('/component', function (req, res) {

		let {
			name,
			apiId
		} = req.body;

		let data = {
			name,
			apiId
		}
		if (validate(name, "string"), validate(apiId, "string")) {
			services.componentService.addComponent(data).then(function (result) {

				console.log("Successfull added component to api");
				return res.status(200).json(result);

			}, function (error) {

				console.log("Error adding component to api");
				return res.send(500, error);

			});
		} else {

			res.status(400).send('INVALID REQUEST')

		}
	})

	return router
}