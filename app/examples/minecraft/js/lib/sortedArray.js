//version 1.0 by robert
var SortedArray = function(array,compare){
    //test if a > b or =
	this.compare = compare || function(a, b) {
        if (a === b) return 0;
        return a > b ? 1 : -1;
    }

    if(array !== undefined){
        for (var i = 0; i < array.length; i++) {
            this.insert(array[i]);
        };
    }
}
SortedArray.prototype = fn.duplicate(Array.prototype);

SortedArray.constructor = SortedArray;
SortedArray.prototype._find = function(item){ //returns the index of the item or the index of where it would fit
    var compare = this.compare;
    var high    = this.length;
    var low     = 0;
    var index   = 0;

    while (high > low) {
        index = (high + low) / 2 >>> 0;
        var ordering = compare(this[index], item);

             if (ordering < 0) low  = index + 1;
        else if (ordering > 0) high = index;
        else return {
            index: index,
            item: this[index]
        };
    }
    index = (high + low) / 2 >>> 0;

    return {
        index: index
    };
}
SortedArray.prototype.insert = function(item){
    var index = this._find(item).index;

    this.splice(index,0,item);

    return this;
}
SortedArray.prototype.select = function(min,max){ //not working
    max = (max!==undefined)? max : min;
    var _min = 0;
    var _max = 0;

    //find the min
    _min = this._find(min);
    _foundMin = _min.item !== undefined;
    _min = _min.index;

    while (true){
        if(!this[_min-1]) break;

        if(this.compare(min,this[_min-1]) == 0){
            _min--;
        }
        else break;
    }

    //find the max
    _max = this._find(max);
    _foundMax = _max.item !== undefined;
    _max = _max.index;

    while (true){
        if(!this[_max+1]) break;

        if(this.compare(max,this[_max+1]) == 0){
            _max++;
        }
        else break;
    }

    return this.slice(_min,_max + _foundMax);
}
SortedArray.prototype.indexOf = function(item){
    var find = this._find(item);
    return (find.item)? find.index : -1;
}
SortedArray.prototype.push = SortedArray.prototype.insert;

if (typeof module === "object") module.exports = SortedArray;