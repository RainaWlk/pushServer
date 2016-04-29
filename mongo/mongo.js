'use strict';
var mongoose = require('mongoose');
var Schemas = require("./schemas.js");
var DeviceModels = require('./deviceModels.js');
var db;

function mongoConnect(){
	return new Promise((resolve, reject) => {
		db = mongoose.createConnection('mongodb://127.0.0.1/Notification');

		db.on('error', () => {
			console.log("connect mongo db error");
			reject();
		});
	    db.once('open', () => {
			console.log("mongo db connected");
			Schemas.initSchema(db);
	    	
	    	resolve(db);
	    });

	});
}

function getDB(){
	return db;
}

exports.newMobel = function(table, jsonObj){
	var model = db.model(table);
	var dbObj = new model(jsonObj);

	return dbObj;
}


exports.init = function(){
	return new Promise((resolve, reject) => {
		mongoConnect().then((queryList) => {
			//console.log(queryList);
			return DeviceModels.syncWithRFM();
		}).then(() => {
			resolve();
		});
	});
}

exports.getDB = getDB;
