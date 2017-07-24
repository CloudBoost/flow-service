const router = require('express').Router();
const services = require('../services');
const util = require('../util');
const {
	validate
} = util

module.exports = function () {


	router.get('/package/all', function (req, res) {

		services.packageService.getPackageList().then(function (result) {

			console.log("Get package list success");
			return res.status(200).json(result);

		}, function (error) {

			console.log("Error getting package list");
			return res.status(500).send(error);

		});
	})

	router.get('/package/info/:name', function (req, res) {

		let name = req.params.name;

		services.packageService.getPackageInfo(name).then(function (result) {

			console.log("Get package info success");
			return res.status(200).json(result);

		}, function (error) {

			console.log("Error getting package info");
			return res.status(500).send(error);

		});

	})

	return router
}