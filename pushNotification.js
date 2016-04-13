'use strict';
var Mongo = require('./mongo.js');
var Schemas = require("./schemas.js");
var Apns = require("./apns.js");
var Gcm = require("./gcm.js");
var Utils = require("./utils.js");

function SOAPPushNotification(){
	this.strModel = "";
	this.strHW = "";
	this.strRegion = "";
	this.strMac = "";
	this.strMsg = "";
}

exports.go = function(conn, para){
	var dataStruct = new SOAPPushNotification();

	//Integrity check & copy
	if(Utils.copyData(dataStruct, para) == false){
		console.log("Integrity check error");
		return false;
	}

	console.log(dataStruct.strMac);
	var mac = dataStruct.strMac.toLowerCase();

	//get token by mac
	var model = Mongo.getDB().model("DeviceRegister");

	var promise = model.find({mac:mac}).exec();

	promise.then(docs => {
		for(var i in docs)
		{
			var type = docs[i].get('type');
			var token = docs[i].get('token');

			switch(type)
			{
				case "ios":
					Apns.send(token, "啾咪咪");
					break;
				case "android":
					Gcm.send(token, "啾咪咪");
					break;
			}

		}
	});
	/*.fail(function(err){
		console.log(err);
	});*/


}