/* eslint-disable no-fallthrough */
import { ADD_PEER, REMOVE_PEER, RESET_STATE, UPDATE_PEER_STREAMS } from '../actions/index.js';

const initialState = {
    peers: [],
}

const peersReducer = (state = initialState, action) => {
    switch (action.type) {

        case ADD_PEER:
            if(state.peers) {
                return {
                    ...state,
                    peers: [...state.peers, {peerID: action.payload.peerID, stream: action.payload.stream}]
                }
            } else {
                return {
                    ...state,
                    peers: [{peerID: action.payload.peerID, stream: action.payload.stream}]
                }
            }

        case REMOVE_PEER:
            console.log("xxxxxxxxxxxxxxxxxxxx", action.payload.peerID)

            return {
                ...state,
                peers: state.peers.filter((peer) => peer.peerID !== action.payload.peerID)
            }
            
        case RESET_STATE:
            return {
                peers: []
            }

        default: 
            return state;
    }
}

export default peersReducer;
