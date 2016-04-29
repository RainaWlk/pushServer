exports.makeArray = function(array){
	var ret = [];
	if( array != null ){
		var i = array.length;
		//單個元素,但window, string、 function有 'length'的屬性,加其他的判斷
		if( i == null || array.split || array.setInterval || array.call )
		{
			ret[0] = array;
		}
		else
		{//類數組的集合
			while(i)
				ret[--i] = array[i];//Clone數組
		}
	}
	return ret;
}