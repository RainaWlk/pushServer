var gcm = require("node-gcm");

//settings


function sendPush_Android(token, msg){
	//var message = new gcm.Message();
	 
	//message.addData('key1', '啾咪咪咪咪咪咪!!');

var message = new gcm.Message({
    collapseKey: 'demo',
    priority: 'high',
    contentAvailable: true,
    delayWhileIdle: false,
    timeToLive: 3,
    //restrictedPackageName: "somePackageName",
    //dryRun: false,
    data: {
        key1: '啾咪咪'
    },
    notification: {
        title: "喵~~~~~~",
        icon: "ic_launcher",
        body: "This is a notification that will be displayed ASAP."
    }
});
	 
	//var regTokens = [token];
	var regTokens = ['APA91bEKpcYMH8WVFnPYSkiCZcszEkmxkPpzQPiiUhNhPQhtf423vhVDXveSGpjRR7aLkmiqVnwBwczyzZoRhYliwZjEjWFOqWWaQ7BoKKyz-KS1MZ65fvJGJIlOUDPAwqcbQfobTek0'];
	 
	// Set up the sender with you API key 
	var sender = new gcm.Sender('AIzaSyB9vkoHZ435D9-BVfyq9QTEkh6bFKxyVw4');
	 
	// Now the sender can be used to send messages 
	sender.send(message, { registrationTokens: regTokens }, function (err, response) {
		if(err) console.error(err);
		else 	console.log(response);
	});
}






function main(){
	var token = "APA91bHALcSE10W9NegrbH2-RR9S9XpXSxtTvaujwD47aqEeDrHIEcj1aMyGOsLoN3TD-LdkfxwubG2Y6QOS4C8Qk4_FUunMpv7wUMPfyqqcCd-q_AOoVuz4bjZDE2RO0MficDG_Hh2d";

	sendPush_Android(token, "啾咪!!!!!!!");
}

main();