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

exports.dataSet = function(cmd, soapObj)
{	
	if(typeof Schemas.schemas[cmd] == 'undefined'){
		return new Promise(function(resolve, reject){
			reject();
		});
	}

	return new Promise(function(resolve, reject){
		var model = db.model(cmd); //model = table name in db

		var Data = new model(soapObj);
		Data.save(function(err){
			if(err)
			{
				console.log(err.errmsg);	
			}
			else
			{
				console.log( cmd +" save OK.");
				resolve();
			}
		});

		/*model.count(function(err, count){ // if there is data in the table
			if (err){	console.log( cmd +" count err.");	}
			else{
				if(count>=1){ //have data, find id & update
					if(count==1){
						model.find(function(err, list){
							if(err) {	console.log( cmd +" find err.");	}
							else{
								var record = list[0];
								var id = record._id;
								model.update( { _id : id }, soapObj, function(err){
									if(err) {	console.log(cmd +" update err.");	}
									else {
										console.log( cmd +" update OK.");
										resolve();
									}
								});
							}
						});
					}
					else{ } // data >1
				}
				else{ //no data, save data
					var Data = new model(soapObj);
					Data.save(function(err){
						if(err) {	console.log( cmd +" save err.");	}
						else {
							console.log( cmd +" save OK.");
							resolve();
						}
					});
				}
			}
		});
		delete mongoose.connection.models[cmd];*/
	});
}
