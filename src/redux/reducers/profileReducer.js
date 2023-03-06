import { GET_PROFILE, GET_PROFILE_ID } from "../actions"


const initialState = {
    data: null,
    profileID: ""
}

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PROFILE:
            return {
                ...state,
                data: action.payload
            }
        case  GET_PROFILE_ID:
            return {
                ...state,
                profileID: action.payload
            }
        default: 
            return state
    }

}

export default profileReducer;