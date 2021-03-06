'use strict';

var xml2js = require('xml2js').parseString;
var DeviceRegister = require("./deviceRegister.js");
var PushNotification = require("./pushNotification.js");
var connInfo = require("./connInfo.js");


exports.go = function(req, res){
	xml2js(req.rawBody, function (err, result) {
		for(var i in result["soap:Envelope"]["soap:Body"][0]){
			var conn = new connInfo.ConnInfo(res);
			var result = route(conn, i, result["soap:Envelope"]["soap:Body"][0][i]);

			if(result == false)
			{
				res.sendStatus("404");
				break;
			}
		}
		//console.log(req.rawBody);
		//console.log(err);
		//console.log(result);
	});
}

function route(conn, cmd, value)
{
	var result = false;
	switch(cmd)
	{
		case "funDeviceRegister":
			result = DeviceRegister.add(conn, value[0]);
			break;
		case "funDeleteDeviceRegister":
			result = DeviceRegister.delete(conn, value[0]);
			break;
		case "funDeleteDeviceRegisterID":
			break;
		case "funPushNotification":
			result = PushNotification.go(conn, value[0]);
			break;
		default:
			break;
	}

	return result;
}


