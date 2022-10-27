

export default function determineNewState(currentState){
    if (currentState.callState === "ready"){
        return { 
            callState: "connecting",
            regToken: currentState.regToken
        }
    }else if(currentState.callState === "connecting"){
        return { 
            callState: "connected",
            regToken: currentState.regToken
        }
    }else if (currentState.callState === "connected"){
        return { 
            callState: "ready",
            regToken: currentState.regToken
        }
    }
}