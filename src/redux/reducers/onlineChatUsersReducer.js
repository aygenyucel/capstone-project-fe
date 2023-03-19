import { ADD_ONLINE_USER } from "../actions";
import { REMOVE_ONLINE_USER } from './../actions/index';

const initialState = {
    data : []
}

const onlineChatUsersReducer = (state = initialState, action) => {
    switch (action.type) {

        case ADD_ONLINE_USER:
            console.log("omggggggggggggggggggggggggggggggg", action.payload.userID)
            if(state.data) {
                return {
                    data: [...state.data, action.payload.userID]
                }
            } else{
                return {
                    data: [action.payload.userID]
                }
            }
                
            
        case REMOVE_ONLINE_USER:
            return {
                data: state.data.filter(user => user !== action.payload.userID) 
            }
    
        default: 
            return state;
    }
}

export default onlineChatUsersReducer;
