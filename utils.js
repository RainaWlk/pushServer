'use strict';

//utils
function isHex(str){
	var rex = /^[0-9A-Fa-f]+$/g;

	if(rex.test(str)) {
		return true;
	}
	return false;
}

function checkMac(mac){
	var macArray = mac.split(":");
	if(macArray.length != 6){
		console.log("mac length error");
		return false;
	}

	for(var i = 0; i < 6; i++){
		if((macArray[i].length != 2)||(isHex(macArray[i]) == false)){
			console.log("error");
			return false;
		}
	}

	return true;
}

function copyData(schema, data)
{
	for(var i in schema)
	{
		if(typeof data[i] == 'undefined')
		{
			console.log(i + " fail");
			return false;
		}
		else if(typeof schema[i] == 'object')
		{
			if(copyData(schema[i], data[i]) == false){
				return false;
			}
		}
		else
		{
			schema[i] = data[i][0];
		}
	}
	return true;
}

//public
exports.isHex = isHex;
exports.checkMac = checkMac;
exports.copyData = copyData;