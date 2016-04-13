'use strict';
var Mongo = require('./mongo.js');
var Schemas = require("./schemas.js");
var Utils = require("./utils.js");

function SOAPDeviceRegister(){
	this.strModel = "";
	this.strHW = "";
	this.strRegion = "";
	this.strMajor = "";
	this.strMinor = "";
	this.strMAC = "";
	this.strToken = "";
	this.strType = "";
}

exports.go = function(conn, para)
{
	var mac = null;
	var token = null;
	var type = null;
	console.log(para);
	var dataStruct = new SOAPDeviceRegister();
	var dbObj = Schemas.newObj("DeviceRegister");

	//Integrity check & copy
	if(Utils.copyData(dataStruct, para) == false){
		console.log("Integrity check error");
		return false;
	}	

	//mac
	mac = dataStruct.strMAC.toLowerCase();
	if(Utils.checkMac(mac) == false)
	{
		return false;
	}
	dbObj["mac"] = mac;

	//token
	token = dataStruct.strToken;
	if(token.length <= 0){
		console.log("token error");
		return false;
	}
	dbObj["token"] = token;

	//type
	type = dataStruct.strType.toLowerCase();
	var devType = null;
	switch(type)
	{
		case "ios":
			devType = "ios";
			break;
		case "android":
			devType = "android";
			break;
		case "win":
			devType = "win";
			break;
		default:
			console.log("type error");
			break;
	}
	if(devType == null)
	{
		return false;	
	}
	dbObj["type"] = devType;

	console.log(dbObj);

	//store to db
	var model = Mongo.getDB().model("DeviceRegister");
	var options = {
		new: true,
		upsert:true
	}

	model.findOneAndUpdate({mac:mac}, dbObj, options, function(err, doc){
		console.log(err);
		console.log(doc);
	});

	//response
	


	return true;
}