/* eslint-disable no-fallthrough */
import { ADD_PEER, REMOVE_PEER, RESET_PEERS_STATE } from '../actions/index.js';

const initialState = {
    peers: [],
}

const peersReducer = (state = initialState, action) => {
    switch (action.type) {

        case ADD_PEER:
            if(state.peers) {
                return {
                    ...state,
                    peers: [...state.peers, {peerID: action.payload.peerID, stream: action.payload.stream, userID: action.payload.userID}]
                }
            } else {
                return {
                    ...state,
                    peers: [{peerID: action.payload.peerID, stream: action.payload.stream, userID: action.payload.userID}]
                }
            }

        case REMOVE_PEER:
            return {
                ...state,
                peers: state.peers.filter((peer) => peer.peerID !== action.payload.peerID)
            }

        case RESET_PEERS_STATE:
            return {
                peers: []
            }

        default: 
            return state;
    }
}

export default peersReducer;
