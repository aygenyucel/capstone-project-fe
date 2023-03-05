export const ADD_PEER= 'ADD_PEER';
export const REMOVE_PEER = 'REMOVE_PEER';
export const RESET_STATE = 'RESET_STATE';
export const UPDATE_PEER_STREAMS = 'UPDATE_PEER_STREAMS'

export const addPeerAction = (peerID, stream) => {
    console.log("addPeerAction triggered => added PeerID: ", peerID)
    return {
        type:ADD_PEER,
        payload: {peerID, stream}
    }
}

export const removePeerAction = (peerID) => {
    console.log("removePeerAction triggered => removed peerID: ", peerID);
    return {
        type:REMOVE_PEER,
        payload: {peerID}
    }
}

export const updatePeerStreamsAction = (peers) => {
    console.log("update peer string triggerssssssssssssss")
    return {
        type: UPDATE_PEER_STREAMS,
        payload: {peers}
    }
}

export const resetStateAction = () => {
    console.log("resetStateAction triggered!")
    return {
        type: RESET_STATE
    }
}