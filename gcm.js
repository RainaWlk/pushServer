var gcm = require("node-gcm");

var APIKEY = 'AIzaSyB9vkoHZ435D9-BVfyq9QTEkh6bFKxyVw4';

//settings
function sendPush_Android(token, msg){
	
	var message = new gcm.Message({
	    collapseKey: 'demo',
	    priority: 'high',
	    contentAvailable: true,
	    delayWhileIdle: false,
	    timeToLive: 3,
	    data: {
	        key1: '啾咪咪'
	    },
	    notification: {
	        title: "喵~~~~~~",
	        icon: "ic_launcher",
	        body: "This is a notification that will be displayed ASAP."
	    }
	});

	return new Promise((resolve, reject) => {
		var sender = new gcm.Sender(APIKEY);
		var regTokens = [token];

		sender.send(message, { registrationTokens: regTokens }, (err, response) => {
			if(err)
			{
				console.error(err);
				//reject();
			}
			else
			{ 
				console.log(response);
				//resolve();
			}
		});
	});
	 

}

exports.send = sendPush_Android;

// test
/*
function main(){
	var token = 'APA91bEKpcYMH8WVFnPYSkiCZcszEkmxkPpzQPiiUhNhPQhtf423vhVDXveSGpjRR7aLkmiqVnwBwczyzZoRhYliwZjEjWFOqWWaQ7BoKKyz-KS1MZ65fvJGJIlOUDPAwqcbQfobTek0';

	sendPush_Android(token, "啾咪!!!!!!!");
}

main();*/