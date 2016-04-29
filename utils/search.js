function _binarySearch(data, array, start, end, eqFunc, searchFunc)
{
	var m = parseInt((end+start)/2);

	if(eqFunc(data,array[m]))
	{
		return m;
	}
	else if(start >= end)	//not found
	{
		return -1;
	}
	else if(searchFunc(data,array[m]))
	{
		return _binarySearch(data, array, start, m-1, eqFunc, searchFunc);
	}
	else 
	{
		return _binarySearch(data, array, m+1, end, eqFunc, searchFunc);
	}
}

exports.binarySearch = function(data, array, eqFunc, searchFunc)
{
	return _binarySearch(data, array, 0, array.length-1, eqFunc, searchFunc);
}