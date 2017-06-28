var Global = {
    newtonversion: 2,
    newtonInstance: false,
    logger: {
        debug: function(){},
        log: function(){},
        info: function(){},
        warn: function(){},
        error: function(){}
    },

    cleanAll: function(){
        this.newtonversion = 2;
        this.newtonInstance = false;
        this.logger = {
            debug: function(){},
            log: function(){},
            info: function(){},
            warn: function(){},
            error: function(){}
        };
    }
};

module.exports = Global;