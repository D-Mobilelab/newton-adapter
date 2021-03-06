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
        currentFlow.name = '';
        currentFlow.props = {};
        currentFlow.started = false;

    }
};

module.exports = publicFlowInterface;