'use strict';
var Mongo = require('./mongo.js');
var Schemas = require("./schemas.js");
var SOAP = require("./SOAP.js");
var Utils = require("./utils.js");

var dbStoreOptions = {
	new: true,
	upsert:true
}


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

function checkAndCopy(dataStruct){
	var obj = Schemas.newObj("DeviceRegister");

	//mac
	var mac = dataStruct.strMAC.toLowerCase();
	if(Utils.checkMac(mac) == false)
	{
		return null;
	}
	obj["mac"] = mac;

	//token
	var token = dataStruct.strToken;
	if(token.length <= 0){
		console.log("token error");
		return null;
	}
	obj["token"] = token;

	//type
	var type = dataStruct.strType.toLowerCase();
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
		return null;
	}
	obj["type"] = devType;

	return obj;
}

function storeToDB(dbObj){
	var model = Mongo.getDB().model("DeviceRegister");

	return new Promise((resolve, reject) => {
		model.findOneAndUpdate({mac: dbObj.mac, token: dbObj.token}, dbObj, dbStoreOptions, function(err, doc){
			if(err)
			{
				console.error(err);
				resolve();
			}
			else
			{ 
				console.log(doc);
				resolve();
			}
		});
	});
}

exports.go = function(conn, para)
{
	console.log(para);
	var dataStruct = new SOAPDeviceRegister();
	

	//Integrity check & copy
	if(Utils.copyData(dataStruct, para) == false){
		console.log("Integrity check error");
		return false;
	}
	var dbObj = checkAndCopy(dataStruct);
	if(dbObj == null){
		return false;
	}

	//store to db
	storeToDB(dbObj).then(() => {
		var soapAction = new SOAP.SOAPAction(conn.res);
		soapAction.sendSOAPAction("funDeviceRegister", null, "OK");		
	});

	return true;
}