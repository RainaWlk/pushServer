'use strict';
var co = require('co');
var Mongo = require('../mongo/mongo.js');
var Schemas = require("../mongo/schemas.js");
var DeviceModels = require("../mongo/deviceModels.js");
var Apns = require("./apns.js");
var Gcm = require("./gcm.js");
var SOAP = require("./SOAP.js");
var Utils = require("../utils/utils.js");

class SOAPPushNotification{
	constructor(){
		this.strModel = "";
		this.strHW = "";
		this.strRegion = "";
		this.strMac = "";
		this.strMsg = "";
	}
}

function check(dataStruct){

	var mac = dataStruct.strMac.toLowerCase();
	if(Utils.checkMac(mac) == false)
	{
		return false;
	}

	return true;
}

function sendSOAPResponse(conn, result){
	var soapAction = new SOAP.SOAPAction(conn.res);

	soapAction.sendSOAPAction("funPushNotification", null, result);
}

exports.go = function(conn, para){
	var dataStruct = new SOAPPushNotification();

	//Integrity check & copy
	if(Utils.copyData(dataStruct, para) == false){
		console.log("Integrity check error");
		return false;
	}
	if(check(dataStruct) == false) {
		return false;
	}

	var mac = dataStruct.strMac.toLowerCase();

	//get registation by mac
	var deviceRegister = Mongo.getDB().model("DeviceRegister");
	var promise = deviceRegister.find({mac:mac}).exec();

	promise.then(docs => {
		var promiseArray = [];

		//co(function *(){
			for(var i in docs)
			{
				var type = docs[i].get('type');
				var token = docs[i].get('token');

				console.log(docs[i]);
				//get model info
				var modelInfo = Mongo.getDB().model("ModelInfo");
				modelInfo.find({_id:docs[i].model_id}).then(modelDocs => {
					console.log(modelDocs[0]);

					switch(type)
					{
						case "ios":
							promiseArray.push(Apns.send(token, dataStruct.strMsg));
							break;
						case "android":
							promiseArray.push(Gcm.send(token, "啾咪咪"));
							break;
					}
				});

			}
		//});
		Promise.all(promiseArray).then(() => {
			sendSOAPResponse(conn, "OK");
		}).catch(() => {
			sendSOAPResponse(conn, "ERROR");
		});
	})
	.catch(function(err){
		console.log(err);
	});

}