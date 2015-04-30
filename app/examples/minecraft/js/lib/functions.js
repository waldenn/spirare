//object functions version 1.2 by robert
fn = {
	//cant use _.extend because it makes a shallow extend
	combindOver: function(obj,obj2,exclude){ //obj2 gose over obj, values that are not in obj are added
		exclude = exclude || [];
		for (var val in obj2){
			if(typeof obj2[val] !== 'object' || exclude.indexOf(val) !== -1){ //if its not an object or weather to skip it
				//see if we are on the client side and if theres ko
				if(obj[val]){
					if(obj[val].__ko_proto__){
						obj[val](obj2[val])
						continue;
					}
				}
				obj[val] = obj2[val];
			}
			else{
				if(typeof obj[val] == 'object'){
					obj[val] = fn.combindOver(obj[val],obj2[val])
				}
				else{
					//see if obj2[val] is an array
					if(obj2[val].hasOwnProperty('length')){
						obj[val] = fn.combindOver([],obj2[val])
					}
					else{
						obj[val] = fn.combindOver({},obj2[val])
					}
				}
			}
		}

		return obj;
	},
	//cant use _.extend because it makes a shallow extend
	combindIn: function(obj,obj2,exclude){ //obj2 gose in obj, values that are not in obj are NOT added (works with arrays)
		exclude = exclude || [];
		for(var i in obj2){
			if(obj[i] != undefined){
				obj[i] = (_.isObject(obj2[i]))? fn.combindIn(obj[i],obj2[i]) : obj2[i];
			}
			//it may a index in a array
			else if(!isNaN(i)){
				obj[i] = (_.isObject(obj2[i]))? fn.duplicate(obj2[i]) : obj2[i];
			}
		}

		return obj;
	},
	//cant use _.clone because it makes a shallow copy
	duplicate: function(obj2,count){
		if(typeof obj2 == 'object' && obj2 !== null){
			count = (count !== undefined)? count : 20;
			if(count > 0){
				// see if its an array
				if(obj2.hasOwnProperty('length')){
					var obj = []
					for (var i = 0; i < obj2.length; i++) {
						if(typeof obj2[i] !== 'object'){
							obj[i] = obj2[i]
						}
						else{
							obj[i] = fn.duplicate(obj2[i],count-1)
						}
					};
				}
				else{
					var obj = {}
					for (var i in obj2){
						if(typeof obj2[i] !== 'object'){
							obj[i] = obj2[i]
						}
						else{
							obj[i] = fn.duplicate(obj2[i],count-1)
						}
					}
				}
			}
			return obj;
		}
		else{
			return obj2
		}
	},
	parseURL: function(url) {
	    var parser = document.createElement('a'),
	        searchObject = {},
	        queries, split, i;
	    // Let the browser do the work
	    parser.href = url;
	    // Convert query string to object
	    queries = parser.search.replace(/^\?/, '').split('&');
	    for( i = 0; i < queries.length; i++ ) {
	        split = queries[i].split('=');
	        searchObject[split[0]] = split[1];
	    }
	    return {
	        protocol: parser.protocol,
	        host: parser.host,
	        hostname: parser.hostname,
	        port: parser.port,
	        pathname: parser.pathname,
	        search: parser.search,
	        searchObject: searchObject,
	        hash: parser.hash
	    };
	},
	isEmptyDiff: function(diff){ //need to build real diff function first, because this dose not take into account remove indexes in arrays
	   return (!_.isEmpty(diff.added) + !_.isEmpty(diff.changed) + !_.isEmpty(diff.removed) == 0);
	},
	getDiff: function(prev, now, str, diff){ //create a diff obj, that contains an array of values that changed and values that have been added/removed
		diff = diff || {
			changed: {},
			added: {},
			removed: {}
		};
		str = str || '';
		combindObj = fn.combindOver(fn.duplicate(prev),now);

		//find the values that have been added
		for(var i in combindObj){
			//see if it was added
			if(prev[i] == undefined){
				diff.added[str+i] = now[i];
			}
			//see if it was removed
			else if(now[i] == undefined){
				diff.removed[str+i] = prev[i];
			}
			//its on both objs, see if its an obj
			else{
				//see if they have the same type
				if(typeof prev[i] === typeof now[i]){
					//is it an object or an array
					if(_.isObject(prev[i])){
						fn.getDiff(prev[i],now[i],str+i+'.',diff);
					}
					else{
						//its a value or a function
						if(prev[i] !== now[i]){
							diff.changed[str+i] = now[i];
						}
					}
				}
				else{
					//they dont have the same type, overwrite the prev
					diff.changed[str+i] = now[i];
				}
			}
		}

		return diff;
	},
	applyDiff: function(obj, diff){ //applys the diff obj created by fn.getDiff
		diff = diff || {
			added: {},
			changed: {},
			removed: {}
		}

		//add
		for(var i in diff.added){
			fn.setValue(obj,i.split('.'),diff.added[i]);
		}
		//change
		for(var i in diff.changed){
			fn.setValue(obj,i.split('.'),diff.changed[i]);
		}
		//remove
		for(var i in diff.removed){
			fn.removeValue(obj,i.split('.'));
		}

		return obj;
	},
	buildDiff: function(diff){ //build an obj that represents the a diff obj
		diff = diff || {
			added: {},
			changed: {},
			removed: {}
		};

		//figure out if its an array
		obj = [];
		for(var i in diff.added){
			if(isNaN(i.split('.')[0])){
				obj = {}
			}
		}
		for(var i in diff.changed){
			if(isNaN(i.split('.')[0])){
				obj = {}
			}
		}

		//add
		for(var i in diff.added){
			fn.setValue(obj,i.split('.'),diff.added[i]);
		}
		//change
		for(var i in diff.changed){
			fn.setValue(obj,i.split('.'),diff.changed[i]);
		}

		return obj;
	},
	setValue: function(obj,a,value){
		if(_.isEmpty(obj[a[0]])){
			obj[a[0]] = (isNaN(a[1]))? {} : [];
		}
		if(a.length == 1){
			obj[a[0]] = value;
			return value;
		}
		else{
			fn.setValue(obj[a.splice(0,1)[0]],a,value);
		}
	},
	removeValue: function(obj,a){
		if(a.length == 1){
			delete obj[a[0]];
		}
		else{
			fn.setValue(obj[a.splice(0,1)[0]],a);
		}
	},
	idArray: function(obj, key, str, base){
		str = str || '';
		base = base || {};
		if(key === undefined || key === ''){
			throw new Error('no key')
		}
		for(var i in obj){
			if(obj[i][key] !== undefined || !_.isObject(obj[i])){
				base[str+i] = obj[i];
			}
			else{
				fn.idArray(obj[i],key,str+i+'.',base)
			}
		}
		return base;
	}
}

if (typeof module === "object") module.exports = fn;