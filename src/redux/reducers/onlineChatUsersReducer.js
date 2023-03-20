import { ADD_ONLINE_USER, RESET_ONLINE_USERS } from "../actions"
import { REMOVE_ONLINE_USER } from './../actions/index';

;

const initialState = {
    data : []
}

const onlineChatUsersReducer = (state = initialState, action) => {
    switch (action.type) {
        
        case ADD_ONLINE_USER:
            console.log("wowowowowo", action.payload)
            if(state.data) {
                let newDataObject = Object.assign(state.data, {...action.payload.userID});
                console.log("omggggggggggggggggggggggggggggggg", action.payload.userID)
                return {
                    ...state,
                   ...newDataObject
                }
            } else{
                let newDataObject = Object.assign(state.data, {...action.payload.userID});
                return {
                    ...state,
                    ...newDataObject
                }
            }
                
            
        case REMOVE_ONLINE_USER:
            return {
                data: state.data.filter(user => user !== action.payload.userID) 
            }

        case RESET_ONLINE_USERS:
            return {
                data: []
            }
        default: 
            return state;
    }
}

export default onlineChatUsersReducer;
