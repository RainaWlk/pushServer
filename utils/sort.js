
function _quickSort(inputArray, func)
{
	var left = 0;
	var right = 0;
	var leftArray = new Array();
	var rightArray = new Array();
	var newArray = new Array();

	var pivotNum = parseInt(inputArray.length/2);
	var pivot = inputArray[pivotNum];

	for(var num in inputArray)
	{
		var data = inputArray[num];
		if(num == pivotNum)
			continue;
		//if(data <= pivot)
		if(func(data,pivot))
		{
			leftArray[left] = data;
			left++;
		}
		else
		{
			rightArray[right] = data;
			right++;
		}
	}

	if(left > 0)
		leftArray = _quickSort(leftArray, func);
	if(right > 0)
		rightArray = _quickSort(rightArray, func);

	//merge
	left = 0;
	for(var i = 0; i < leftArray.length; i++)
	{
		newArray[left] = leftArray[i];
		left++;
	}
	newArray[left] = pivot;
	left++;
	for(var i = 0; i < rightArray.length; i++)
	{
		newArray[left] = rightArray[i];
		left++;
	}

	return newArray;
}

exports.quickSort = function(inputArray, func)
{
	return _quickSort(inputArray, func);
}


/*var Search = require('./search.js');

function main()
{
	var array = new Array();

	for(var i = 0; i < 30; i++)
	{
		array[i] = Math.floor((Math.random() * 100) + 1);
	}

	console.log("before: "+array);
	array = _quickSort(array, function(a,b){
		if(a > b)
			return true;

		return false;
	});

	console.log("after: "+array);

	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	process.stdin.on('data', function(chunk){
		var loc = Search.binarySearch(parseInt(chunk), array);
		if(loc >= 0)
			process.stdout.write("found at: " + loc + "\n");
		else
			process.stdout.write("not found\n");
	});

	//set exit signal
	process.on('SIGINT', function(){
		process.stdout.write("Bye\n");
		process.exit();
	});

}

main();*/