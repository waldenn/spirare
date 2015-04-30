(this.window||module)[(this.window ? 'Events' : 'exports')] = function Minivents (target){
    var events = {};
    target = target || this;
    if(target === this.window) throw new Error('have to use to "new" operator');
    target.on = function(type, func, ctx){
        (events[type] = events[type] || []).push({f:func, c:ctx, r:false})
    }
    target.once = function(type, func, ctx){
        (events[type] = events[type] || []).push({f:func, c:ctx, r: true})
    }
    target.off = function(type, func){
        var list = events[type] || [],
        i = list.length = func ? list.length : 0
        while(i-->0) func == list[i].f && list.splice(i,1)
    }
    target.emit = function(){
        var args = Array.apply([], arguments),
            type = args.shift(),
            list = events[type] || [], i=0, j;
        for(;j=list[i++];){
            j.f.apply(j.c, args);
            if(j.r) target.off(type,j.f);
        }
    }
    target.clear = function(type){
        if(!type)
            events = {};
        else
            events[type] == [];
    }
}