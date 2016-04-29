'use strict';
var util = require('util');
var mongoose = require('mongoose');
var $ = require('../utils/jquery.js');

var schemas = { //table & table str, in db
	"ModelInfo": {
		"model": String,	//model name and hw ver
		"region": String,	
		"msg": String
	},
	"DeviceRegister":{
		"mac": String,
		"token" : String,
		"type": String,
		"ver": String,
		"model_id": mongoose.Schema.Types.ObjectId
	}
};

exports.schemas = schemas;

exports.initSchema = function(db){
	for(var table in schemas)
	{
		var schema = mongoose.Schema(schemas[table], {pluralization: false});	//複數形檢查，囧
		db.model(table, schema);
	}
}

function createSchema(obj){
	var result = {};

	if(typeof obj != "undefined")
	{
		for(var i in obj)
		{
			if(typeof obj[i] == "function")
			{
				result[i] = obj[i]();
			}
			else if(util.isArray(obj[i]) == true)
			{
				result[i] = $.makeArray(createSchema(obj[i][0]));
			}
			else if(typeof obj[i] == "object")
			{
				result[i] = createSchema(obj[i]);
			}
			else
			{
				console.log("!!!!!!!!!!!!! createSchema: "+ obj[i] +" !!!!!!!!!!!!!");
			}
		}
	}
	return result;
}

exports.newObj = function(table){
	var obj = schemas[table];
	var result = createSchema(obj);
	return result;
}