'use strict';
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var EventEmitter = require('events').EventEmitter;
var watcher = new EventEmitter();
watcher.setMaxListeners(500);

var MAX_CONNECTION = 50;

var config = {
	userName: 'WRPD',
	password: 'Ab123456',
	//server: '127.0.0.1',
	server: '54.214.11.134',
	    
	// If you're on Windows Azure, you will need this:
	//     options: {encrypt: true}
	options: {database: 'RFM'}
};

class DBConnection {
	constructor(){
		this.connection = null;
		this._idle = true;
	}

	set idle(b){
		this._idle = b;
		if(b == true)
		{
			watcher.emit('release', this);
		}
	}

	get idle(){
		return this._idle;
	}
}

function DBConnectionList(){
	this.list = new Array();

}

DBConnectionList.prototype.push = function(obj){
	this.list.push(obj);
}

DBConnectionList.prototype.remove = function(conn){

	for(var i in this.list)
	{
		var dbConn = this.list[i];
		if(dbConn.connection == conn)
		{
			this.list.splice(i, 1);
		}
	}
}

var dbConnList = new DBConnectionList();


function createConnection(){
	return new Promise((resolve, reject) => {
		var connection = new Connection(config);
		console.log("new connection");

		connection.on('connect', function(err) {
			// If no error, then good to go...
			if(err)
			{
				console.log("err="+err);
				reject();
				return;
			}
			
			console.log("connected");
			resolve(connection);
		});

		connection.on('end', function(err){
			dbConnList.remove(connection);
			console.log("connection end..... count:"+dbConnList.list.length);
		});
	});
}

exports.getConnection = function(){
	return new Promise((resolve, reject) => {
		var found = false;

		for(var i in dbConnList.list)
		{
			var dbConn = dbConnList.list[i];
			if(dbConn.idle == true)
			{
				found = true;
				resolve(dbConn);
			}
		}

		//no idle connection avaliable
		if(found == false)
		{
			if(dbConnList.list.length <= MAX_CONNECTION)
			{
				var newDBConnection = new DBConnection();
				dbConnList.push(newDBConnection);
				createConnection().then((newConn) => {
					newDBConnection.connection = newConn;

					resolve(newDBConnection);
				});
			}
			else
			{
				//pipe
				watcher.on('release', (dbConn) => {
					resolve(dbConn);
				});
			}
		}
	});

}