module.exports.Identity = function Identity(type){
    this.type = type;
    
    this.getType = function(){
        return this.type;
    };

    this.delete = function(fn){
        setTimeout(function(){
            fn(null);
        }, 10);        
    };
};

module.exports.noop = function noop(){};