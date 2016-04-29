var apn = require("apn");

//settings
var iOSoptions = {
	"passphrase": "1111",
	"production": false
};

function sendPush_iOS(token, msg){
	console.log("send to iOS...");
	console.log(token);
	return new Promise((resolve, reject) => {
		var apnConnection = new apn.Connection(iOSoptions);
		var device = new apn.Device(token);

		var note = new apn.Notification();
		note.alert = msg;
		note.sound = 'default';
		note.badge = 1;
		note.expiry = Math.floor(Date.now() / 1000) + 60;

		apnConnection.pushNotification(note, device);
		//temp: need feedback
		resolve();
	});
}

exports.send = sendPush_iOS;

// for test

/*function main(){
	var token = "be3aeedc756ba29e012a2bb74db683ff6905f8d9a8ad07fd8dc9cf308f07f578";

	sendPush_iOS(token, "啾咪!!!!!!!");
}

main();*/
