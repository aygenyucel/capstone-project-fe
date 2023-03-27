
import { ADD_NEW_ROOM, DELETE_ROOM, RESET_ROOMS_STATE, GET_ROOMS, UPDATE_ROOM_USERS } from './../actions/index';

const initialState = {
    rooms: [],
    users: []
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
        case GET_ROOMS:
            return {
                ...state,
                rooms: action.payload
            }

        case UPDATE_ROOM_USERS:
            console.log("lets seee if reducer will be updated, action.payload =>", action.payload)
            
            return {
                ...state,
                rooms: state.rooms.filter(room => room._id === action.payload.roomID ? {...room, users: action.payload.users} : room),
                users: action.payload.users
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