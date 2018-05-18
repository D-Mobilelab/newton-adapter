/* global Newton */
var isFlowStarted = false;

const currentFlow = {
    name: '',
    props: {}
};

const publicFlowInterface = {
    setCurrentFlow: function(options){
        currentFlow.name = options.name;
        currentFlow.props = options.properties

        isFlowStarted = true;        
    },
    getCurrentFlow: function(){
        if(isFlowStarted){
            return currentFlow;
        } else {
            return false;
        }
    },
    isFlowStarted: function(){
        return isFlowStarted;
    },
    cleanCurrentFlow: function(){
        isStarted = false;
        
        currentFlow.name = '';
        currentFlow.props = {};
    }
}

module.exports = publicFlowInterface;