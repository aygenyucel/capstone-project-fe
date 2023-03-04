/* eslint-disable no-fallthrough */
import { ADD_PEER, REMOVE_PEER, RESET_STATE } from '../actions/index.js';

const initialState = {
    peers: [{peerID: "", stream: null}]
}


const peersReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PEER:
            
            return {
                ...state,
                peers: [...state.peers, {peerID: action.payload.peerID, stream: action.payload.stream}]

            }
        case REMOVE_PEER:
            const updatedPeers = state.peers.filter((peer) => peer.peerID !== action.payload.peerID)
            return updatedPeers
        case RESET_STATE:
            return {
                undefined
            }
        default: 
            return state;
    }
}

export default peersReducer;
// rooms:[
//     {
//         roomID: "",
//         peers: [
//             {
//                 peerID: "",
//                 stream: null,
//             }
//         ]
//     }
// ]