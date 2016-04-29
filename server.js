'use strict';
var express = require("express");
var app = express();
var http = require("http").Server(app);
var bodyParser = require('body-parser');
var mongo = require("./mongo/mongo.js");
var webService = require("./webService/webService.js");

function main(){
	http.listen(8080, function(){
		console.log("listen callback");
	});

	app.use(bodyParser.json());

	console.log("Server has started.");

	mongo.init().then(function(){
		console.log("then");
	}).catch(function(){
		console.log("catch");
	});

	app.post('/WebService.asmx',function(req, res, next){
		req.rawBody = '';
		req.setEncoding('utf8');

		req.on('data', function(chunk) { 
			req.rawBody += chunk;
		});
		
		req.on('end', function() {
			webService.go(req, res);
		});

	});

}

main();