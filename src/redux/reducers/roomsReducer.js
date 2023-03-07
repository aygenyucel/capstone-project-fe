import { ADD_NEW_ROOM, DELETE_ROOM, RESET_ROOMS_STATE } from './../actions/index';

const initialState = {
    rooms: []
}

const roomsReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_NEW_ROOM:
            return {
                ...state,
                rooms: [...state.rooms, action.payload]
            }
        case DELETE_ROOM:
            return {
                ...state,
                rooms: state.rooms.filter(room => room._id !== action.payload)
            }
        case RESET_ROOMS_STATE:
            return {
                rooms: []
            }
        default:
            return state        
    }

}

export default roomsReducer;