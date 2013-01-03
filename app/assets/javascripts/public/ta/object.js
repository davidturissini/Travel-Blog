window.TA.Object = {
	serialize: function(obj) {
	  var str = [];
	  for(var p in obj)
	     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	  return str.join("&");
	},
	extend:function (obj1, obj2) {

		for(var x in obj2) {
			if(obj2.hasOwnProperty(x)) {
				obj1[x] = obj2[x];
			}
		}

		return obj1;

	}
}