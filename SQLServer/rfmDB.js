'use strict';
var Request = require('tedious').Request;
var Sort = require("../utils/sort.js");
var Search = require('../utils/search.js');

var ProductInfoList = null;

class ProductInfo
{
	constructor(id, model, hw){
		this.PI_ID = id;
		this.PI_ModelName = model;
		this.PI_HWVersion = hw;

		this.PR = [];	
	}
}

class RegionInfo
{
	constructor(id, product_id, region){
		this.PR_ID = id;
		this.PR_PI_ID = product_id;
		this.PR_Region = region;	
		this.pushMsg = "";
	}
}



function makeProductInfo(dbConn)
{
	ProductInfoList = [];

	return new Promise((resolve, reject) => {
		var request = new Request('select * from dbo.ManageMent_ProductInfo', function(err, rowCount) {
			if(err)
			{
				console.log(err);
				return false;
			}
			//dbConn.idle = true;
			
			console.log("ManageMent_ProductInfo: "+rowCount+" rows");

			resolve();
		});
		

		request.on("row", function(columns){
			//console.log(columns[0].metadata.colName+"="+columns[0].value);
			//console.log(columns[1].metadata.colName+"="+columns[1].value);
			//console.log(columns[2].metadata.colName+"="+columns[2].value);

			//PI_Status
			var PI_Status = parseInt(columns[6].value);
			if(PI_Status == 1)
			{
				var product = new ProductInfo(columns[0].value, columns[1].value, columns[2].value);
				ProductInfoList.push(product);
			}
		});

		//dbConn.idle = false;
		dbConn.connection.execSql(request);
	});
}

function makeRegionInfo(dbConn)
{
	return new Promise((resolve, reject) => {
		var RegionInfoList = [];

		var request = new Request('select * from dbo.ManageMent_ProductRegion', function(err, rowCount) {
			if(err)
			{
				console.log(err);
				return false;
			}

			console.log("ManageMent_ProductRegion: "+rowCount+" rows");
			resolve(RegionInfoList);
		});

		request.on("row", function(columns){
			var rowData = "";
			//console.log(columns[0].metadata.colName+"="+columns[0].value);
			//console.log(columns[1].metadata.colName+"="+columns[1].value);
			//console.log(columns[2].metadata.colName+"="+columns[2].value);

			//PI_Status
			var PR_Status = parseInt(columns[3].value);
			if(PR_Status == 1)
			{
				var region = new RegionInfo(columns[0].value, columns[1].value, columns[2].value);
				RegionInfoList.push(region);
			}
		});

		dbConn.connection.execSql(request);
	});
}

function createProductRegionInfo(productList, region)
{
	//define
	var eqFunc = function(a,b){
		if(a == b.PI_ID)
			return true;
		return false;
	};
	var searchFunc = function(a,b){
		if(parseInt(a) < parseInt(b.PI_ID))
			return true;
		return false;
	};

	for(var num in region)
	{
		var regionObj = region[num];

		var loc = Search.binarySearch(regionObj.PR_PI_ID, productList, eqFunc, searchFunc);
		if(loc >= 0)
		{
			var product = productList[loc];
			product.PR.push(regionObj);
		}
		else
		{
			console.log("err:"+regionObj.PR_PI_ID+" "+regionObj.PR_Region);
		}
	}

	//translate
	var QueryList = {};
	for(var i in productList)
	{
		var product = productList[i];

		//console.log("PI_ID="+product.PI_ID);
		//console.log("PI_ModelName="+product.PI_ModelName);
		//console.log("PI_HWVersion="+product.PI_HWVersion);

		//console.log(product.PR);

		//translate
		var modelStr = product.PI_ModelName + "_" + product.PI_HWVersion;
		QueryList[modelStr] = product.PR;
	}

	return QueryList;
}

exports.findProduct = function(model, hw)
{
	for(var i in ProductInfoList)
	{
		var obj = ProductInfoList[i];
		if((obj.PI_ModelName == model) && (obj.PI_HWVersion == hw))
		{
			return obj;
		}
	}
	return null;
}

exports.addProductInfo = function(dbConn, queryList, model, hw)
{
	return new Promise((resolve, reject) => {
		var product = null;
		//console.log("addProductRegionInfo:"+model+"_"+hw);
		var sql = "select * from dbo.ManageMent_ProductInfo where PI_ModelName='"+model+"' AND PI_HWVersion='"+hw+"' AND PI_Status=1;";

		var productRequest = new Request(sql, function(err, rowCount) {
			if(err)
			{
				console.log(err);
				return false;
			}
			//dbConn.idle = true;
			
			//console.log("ManageMent_ProductInfo: "+rowCount+" rows");

			resolve(product);
		});
		

		productRequest.on("row", function(columns){
			//console.log(columns[0].metadata.colName+"="+columns[0].value);

			product = new ProductInfo(columns[0].value, model, hw);
			ProductInfoList.push(product);
		});

		//dbConn.idle = false;
		dbConn.connection.execSql(productRequest);
	});
}

exports.addRegionInfo = function(dbConn, queryList, productObj, region)
{
	return new Promise((resolve, reject) => {
		var regionList = [];
		var PR_ID = "";
		//console.log("addRegionInfo:"+region);
		var sql = "select PR_ID from dbo.ManageMent_ProductRegion where PR_PI_ID='"+productObj.PI_ID+"' AND PR_Region='"+region+"' AND PR_Status=1;";

		var regionRequest = new Request(sql, function(err, rowCount) {
			if(err)
			{
				console.log(err);
				return false;
			}
			//dbConn.idle = true;
			
			//console.log("ManageMent_ProductRegion: "+rowCount+" rows");

			var modelStr = productObj.PI_ModelName + "_" + productObj.PI_HWVersion;
			queryList[modelStr] = productObj.PR;

			resolve(PR_ID);
		});
		

		regionRequest.on("row", function(columns){
			//console.log(columns[0].metadata.colName+"="+columns[0].value);

			PR_ID = columns[0].value;
			var regionObj = new RegionInfo(PR_ID, productObj.PI_ID, region);

			productObj.PR.push(regionObj);
		});

		//dbConn.idle = false;
		dbConn.connection.execSql(regionRequest);
	});
}

exports.MakeBaseData = function(msdbConn)
{
	return new Promise((resolve, reject) => {
		makeProductInfo(msdbConn).then(function()
		{
			ProductInfoList = Sort.quickSort(ProductInfoList, function(a,b){
				if(parseInt(a.PI_ID) < parseInt(b.PI_ID))
					return true;

				return false;
			});

			return makeRegionInfo(msdbConn);
		})
		.then((regionList) => {
			var queryList = createProductRegionInfo(ProductInfoList, regionList);

			resolve(queryList);
		});
	});
}
