var co = require('co');
var DBConn = require('./dbConn.js');
var RFMDB = require("../SQLServer/rfmDB.js");
var Mongo = require('./mongo.js');
var Schemas = require("./schemas.js");

var dbStoreOptions = {
	new: true,
	upsert:true
}

function findDevice(name, region){
	var model = Mongo.getDB().model("ModelInfo");

	return new Promise((resolve, reject) => {
		model.find({model:name, region:region}).then(docs => {
			resolve(docs);
		}).catch(err => {
			reject(err);
		});
	});
}

function findAndUpdateDevice(dbObj){
	var model = Mongo.getDB().model("ModelInfo");

	return new Promise((resolve, reject) => {
		model.findOneAndUpdate({model:dbObj.model, region:dbObj.region}, dbObj, dbStoreOptions).then(docs => {
			resolve(docs);
		}).catch(err => {
			reject(err);
		});
	});
}


function syncWithRFM(){
	return new Promise((resolve, reject) => {
		DBConn.getConnection().then((dbConn) => {
			return RFMDB.MakeBaseData(dbConn);
		}).then((queryList) => {
			//sync with RFM DB
			co(function *(){
				for(var i in queryList)
				{
					for(var regionInfo in queryList[i])
					{
						var modelObj = makeModelInfoObj(i, queryList[i][regionInfo]);
						yield findAndUpdateDevice(modelObj).then((docs) => {
							//console.log(docs);
							console.log("update done:"+i);
						}).catch((err) => {
							console.log("update err");
						});
						
					}
				}
			});

			resolve();
		});
	});
}

//convert RFM db obj to Mongo doc
function makeModelInfoObj(name, PR_detail){
	var modelObj = Schemas.newObj("ModelInfo");

	modelObj.model = name;
	modelObj.region = PR_detail.PR_Region;
	modelObj.msg = "New Firmware available for your " + name;	//temp

	return modelObj;
}

exports.syncWithRFM = syncWithRFM;
exports.findDevice = findDevice;