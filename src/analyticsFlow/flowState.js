var currentFlow = {
    name: '',
    props: {},
    started: false
};

var publicFlowInterface = {
    setCurrentFlow: function(options){
        currentFlow.name = options.name;
        currentFlow.props = options.properties;
        currentFlow.started = true;        
    },
    getCurrentFlow: function(){
        return currentFlow;
    },
    isFlowStarted: function(){
        return currentFlow.started;
    },
    cleanCurrentFlow: function(){
        currentFlow.started = false;
        currentFlow.name = '';
        currentFlow.props = {};

    }
};

module.exports = publicFlowInterface;