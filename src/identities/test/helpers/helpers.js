module.exports.Identity = function Identity(type){
    this.type = type;
    
    this.getType = function(){
        return this.type;
    }

    this.delete = function(fn){
        fn(null);
    }
}

module.exports.noop = function noop(){}