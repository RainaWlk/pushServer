'use strict';

var xml2js = require('xml2js').parseString;
var DeviceRegister = require("./deviceRegister.js");
var PushNotification = require("./pushNotification.js");

function ConnInfo(res)
{
	this.res = res;
}

exports.go = function(req, res){
	xml2js(req.rawBody, function (err, result) {
		for(var i in result["soap:Envelope"]["soap:Body"][0]){
			var conn = new ConnInfo(res);
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
	var result = null;
	switch(cmd)
	{
		case "funDeviceRegister":
			result = DeviceRegister.go(conn, value[0]);
			break;
		case "funDeleteDeviceRegister":
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


