export const ADD_PEER= 'ADD_PEER';
export const REMOVE_PEER = 'REMOVE_PEER';
export const RESET_STATE = 'RESET_STATE';


export const addPeerAction = (peerID, stream) => {
    return {
        type:ADD_PEER,
        payload: {peerID, stream}
    }
}
export const removePeerAction = (peerID) => {
    return {
        type:REMOVE_PEER,
        payload: {peerID}
    }
}

export const resetStateAction = () => {
    return {
        type: RESET_STATE
    }
}