'use strict';
var mongoose = require('mongoose');
var Schemas = require("./schemas.js");
var db;

exports.connect = function(){
	return new Promise(function(resolve, reject){
		db = mongoose.createConnection('mongodb://127.0.0.1/Notification');

		db.on('error',function(){
			console.log("connect db error");
			reject();
		});
	    db.once('open',function(){
			console.log("db connected");
			Schemas.initSchema(db);
	    	
	    	resolve(db);
	    });

	});
}

exports.getDB = function(){
	return db;
}

exports.newMobel = function(table, jsonObj){
	var model = db.model(table);
	var dbObj = new model(jsonObj);

	return dbObj;
}

