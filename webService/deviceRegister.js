'use strict';
var Mongo = require('../mongo/mongo.js');
var Schemas = require("../mongo/schemas.js");
var DeviceModels = require("../mongo/deviceModels.js");
var SOAP = require("./SOAP.js");
var Utils = require("../utils/utils.js");

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
	this.strMac = "";
	this.strToken = "";
	this.strType = "";
}

function SOAPDeleteDeviceRegister(){
	this.strMac = "";
	this.strToken = "";
}

function checkAndCopy(dataStruct){
	var obj = Schemas.newObj("DeviceRegister");

	//mac
	var mac = dataStruct.strMac.toLowerCase();
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

function storeToDB(dbObj, reqStruct){
	var model = Mongo.getDB().model("DeviceRegister");

	return new Promise((resolve, reject) => {
		//others
		var name = reqStruct.strModel + "_" + reqStruct.strHW;

		DeviceModels.findDevice(name, reqStruct.strRegion).then(docs => {
			//model+region must unique
			dbObj['model_id'] = docs[0]._id;
			return model.findOneAndUpdate({mac: dbObj.mac, token: dbObj.token}, dbObj, dbStoreOptions);
		}).then(docs => {
			resolve(docs);
		}).catch(err => {
			reject(err);
		});
	});
}

function deleteFromDB(reqStruct){
	var model = Mongo.getDB().model("DeviceRegister");

	var mac = reqStruct.strMac;
	var token = reqStruct.strToken;

	return new Promise((resolve, reject) => {
		model.find({mac:mac, token:token}).remove().then(docs => {
			console.log(docs);
			resolve();
		}).catch(err => {
			console.log(err);
			reject();
		});
	});
}

exports.add = function(conn, para)
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
	var soapAction = new SOAP.SOAPAction(conn.res);
	storeToDB(dbObj, dataStruct).then(docs => {
		soapAction.sendSOAPAction("funDeviceRegister", null, "OK");		
	}).catch(err => {
		soapAction.sendSOAPAction("funDeviceRegister", null, "ERROR");		
	});

	return true;
}

exports.delete = function(conn, para)
{
	console.log(para);
	var dataStruct = new SOAPDeleteDeviceRegister();
	

	//Integrity check & copy
	if(Utils.copyData(dataStruct, para) == false){
		console.log("Integrity check error");
		return false;
	}

	//check


	//store to db
	var soapAction = new SOAP.SOAPAction(conn.res);
	deleteFromDB(dataStruct).then(docs => {
		soapAction.sendSOAPAction("funDeviceRegister", null, "OK");		
	}).catch(err => {
		soapAction.sendSOAPAction("funDeviceRegister", null, "ERROR");		
	});

	return true;	
}