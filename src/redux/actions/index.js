export const ADD_PEER= 'ADD_PEER';
export const REMOVE_PEER = 'REMOVE_PEER';
export const RESET_PEERS_STATE = 'RESET_PEERS_STATE';
export const UPDATE_PEER_STREAMS = 'UPDATE_PEER_STREAMS'
export const GET_PROFILE = 'GET_PROFILE'
export const GET_PROFILE_ID = 'GET_PROFILE_ID'
export const ADD_NEW_ROOM = 'ADD_NEW_ROOM'
export const DELETE_ROOM ='DELETE_ROOM'
export const RESET_ROOMS_STATE = 'RESET_ROOMS_STATE';
export const GET_ROOMS= 'GET_ROOMS' //fetching /GET
export const UPDATE_ROOM_USERS = 'UPDATE_ROOM_USERS';
export const ADD_MESSAGE_TO_CHAT = 'ADD_MESSAGE_TO_CHAT';
export const UPDATE_CHAT ='UPDATE_CHAT';
export const ADD_ONLINE_USER = 'ADD_ONLINE_USER';
export const REMOVE_ONLINE_USER = 'REMOVE_ONLINE_USER'
export const RESET_ONLINE_USERS = 'RESET_ONLINE_USERS'

const BE_DEV_URL = process.env.REACT_APP_BE_DEV_URL

export const addPeerAction = (peerID, stream, userID, roomEndpoint) => {
    console.log("addPeerAction triggered => added PeerID: ", peerID, "userID =>", userID, "roomEndpoint =>", roomEndpoint)
    addOnlineUsersAction(userID)
    return {
        type:ADD_PEER,
        payload: {peerID, stream, userID, roomEndpoint}
    }
}

export const removePeerAction = (peerID, userID) => {
    console.log("removePeerAction triggered => removed peerID: ", peerID);
    removeOnlineUsersAction(userID)
    return {
        type:REMOVE_PEER,
        payload: {peerID, userID}
    }
}

export const addMessageToChatAction = (newMessage) => {
    console.log("addMessageToChatAction triggered => new message:", newMessage);
    return {
        type: ADD_MESSAGE_TO_CHAT,
        payload: {newMessage}
    }
}

export const updateChatAction = (chat) => {
    console.log("addMessageToChatAction triggered => chat:", chat);
    return {
        type: UPDATE_CHAT,
        payload: {chat}
    }
}

export const updateRoomChatAction = (roomID, newMessage, chat) => {
    return new Promise(async (resolve, reject) => {
        // const options = {
        //     method: "POST",
        //     body: JSON.stringify(newMessage),
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // }
        // try {
        //     const response = await fetch(`${BE_DEV_URL}/roomChats`, options);

        //     if(response.ok) {
        //         const roomChatData = await response.json();
        //         const roomChatId = roomChatData._id

                try {
                    console.log("wtisth,", chat);
                    const response= await fetch(`${BE_DEV_URL}/rooms/${roomID}`, 
                    {method: "PUT", 
                    body: JSON.stringify({chat: chat}), 
                    headers: {
                                "Content-Type": "application/json"
                            }})
                    if(response.ok) {
                        const roomData = await response.json();
                        console.log("######", roomData);

                        resolve(roomData)
                    } else {
                        console.log("sorryyy, there is a problem when fetching!")
                    }
                } catch (error) {
                    reject(error)
                }
        //     }
        //     else {
        //         console.log("sorryyy, there is a problem when fetching!")
        //     }
            
        // } catch (error) {
        //     reject(error)
        // }
    })
}

export const updatePeerStreamsAction = (peers) => {
    console.log("update peer string triggerssssssssssssss")
    return {
        type: UPDATE_PEER_STREAMS,
        payload: {peers}
    }
}

export const resetPeersStateAction = () => {
    console.log("resetStateAction triggered!")
    return {
        type: RESET_PEERS_STATE
    }
}
export const resetRoomsStateAction = () => {
    console.log("resetRoomStateAction triggered!")
    return {
        type: RESET_ROOMS_STATE
    }
}

export const resetOnlineUsersAction = () => {
    console.log("resetOnlineUsers action triggered!")
    return {
        type: RESET_ONLINE_USERS
    }
}
export const signupAndGetTokenAction = (newUser) => {
    return new Promise(async (resolve, reject) => {

        console.log("signupAndGetTokenAction Triggered!")
        const options = {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json"
            }
        }
            try {
                const response = await fetch(`${BE_DEV_URL}/users/signup`, options);
                if(response.ok) {
                    const data= await response.json()
                    const {JWTToken} = data
                    console.log("JWTToken => ", JWTToken)
                    resolve({})
                } else {
                    response.text()
                    .then(text => {
                        throw new Error(text)
                    })
                    console.log("Ops, something went wrong", )
                }
                
            } catch (error) {
                console.log("🚀 error", error)
                reject(error)
            }
    })
}

export const loginAndGetTokenAction = (user) => {
   return new Promise( async (resolve, reject) => {
        console.log("loginAndGetTokenAction triggered!")
        const options = {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        }
        
            try {
                const response = await fetch(`${BE_DEV_URL}/users/login`, options)

                if(response.ok) {
                    const data = await response.json();
                    const {JWTToken} = data;
                    console.log("JWTToken => ", JWTToken);
                    if(JWTToken) {
                        console.log("whyyyyyy")
                        const options = {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization:  "Bearer "+ JWTToken
                            }
                        }
                        try {
                            const response = await fetch(`${BE_DEV_URL}/users/me`, options);
                            if(response.ok){
                                const user = await response.json()
                                console.log(user)
                                if(user) {
                                    localStorage.setItem("JWTToken", JWTToken)
                                    
                                    const dispatchAction1 = {
                                        type: GET_PROFILE,
                                        payload: user
                                    }
                                        
                                    const dispatchAction2 = {
                                        type: GET_PROFILE_ID,
                                        payload: user._id
                                    }
                                        
                                    
                                    

                                    resolve({dispatchAction1, dispatchAction2})
                                }
                            } 
                        } catch (error) {
                            console.log(error);
                        }
                    }

                    resolve({})
                } else{
                    response.text()
                        .then(text => {
                            throw new Error(text)
                        })
                        console.log("Ops, something went wrong", )
                }
                
            } catch (error) {
                console.log(error)
                reject(error)
            }
        
    }) 
}

//checking if we have jwt token and user 
//(if we have jwt but not user data, try to fetch user with that jwt)
//returns a boolean
export const isLoggedInAction =  (userState, JWTToken, dispatch) => {
    return new Promise (async (resolve, reject) => {
        
        if(JWTToken) {
            //if we have JWT token, need to check user
            if(userState){
                //if we have user, return true
                resolve(true)
            } else {
                //if we have not user, try to fetch with JWT token
                const options = {
                    method: "GET",
                    headers:{
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + JWTToken
                    }
                }
                try {
                       
                        console.log("we have jwt but not user redux, fetching /users/me with jwt and saving user if ok")
                        const response = await fetch(`${BE_DEV_URL}/users/me`, options);
                        
                        if(response.ok) {
                            
                            const data = await response.json();
                            console.log("dataaaa:", data);
                            dispatch({
                                type: GET_PROFILE,
                                payload: data
                            })
                            dispatch({
                                type: GET_PROFILE_ID,
                                payload: data._id
                            })  
                            resolve(true)
                        } 
                        else{
                            resolve(false)
                        }
    
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }
                
            }

        } else {
            //if we dont have JWT token, return false
            resolve(false);
        }
    })
}

export const addNewRoomAction = (newRoomData) => {
    console.log("addNewRoomAction triggered", newRoomData);
    return {
        type: ADD_NEW_ROOM,
        payload: newRoomData
    }
}

export const deleteRoomAction = (deletedRoomID) => {
    console.log("deleteRoomActionTriggered");
    return {
        type: DELETE_ROOM,
        payload: deletedRoomID
    }
}

export const getAllRoomsAction = () => {
    return new Promise(async (resolve, reject) => {
        
            const options = {
                method: "GET",
                headers:{
                    "Content-Type": "application/json"
                }
            }
            try {
                const response = await fetch(`${BE_DEV_URL}/rooms`, options)
    
                if(response.ok) {
                    const data = await response.json();
                    
                    const action = {type: GET_ROOMS, payload: data}
                    resolve(action);
                } else {
                    throw new Error("oppppss something went wrong when fetching!")
                }
                
            } catch (error) {
                console.log(error)
                reject(error)
            }
    })
}

export const updateRoomUsersAction = (users, roomID, userID) => {
    console.log("updateRoomUsersAction triggered!! users =>", users, "roomID =>", roomID)
    return new Promise (async (resolve, reject) => {
        //first we'll update the users of room on database
        //then we'll resolve the action to update reducer
        const options = {
            method: "PUT",
            body: JSON.stringify({users: users}),
            headers:{
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await fetch(`${BE_DEV_URL}/rooms/${roomID}`, options)
            
            if(response.ok) {
                const updatedRoom = await response.json()
                console.log("updateRoomUsersAction triggered!! fetch the PUT endpoint response json =>", updatedRoom)
                const action = {
                    type: UPDATE_ROOM_USERS,
                    payload: {users, roomID, userID}
                }

                resolve(action)
            } else {
                throw new Error("oppppss something went wrong when fetching!")
            }
            
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

//adding online users in the all chat rooms
export const addOnlineUsersAction = (userID) => {
    console.log("addOnlineUsersAction triggered => userID :", userID)
    return {
        type: ADD_ONLINE_USER,
        payload: {userID}
    }
}

//removing online users in the all chat rooms
export const removeOnlineUsersAction = (userID) => {
    console.log("removeOnlineUsersAction triggered => userID :", userID)

    return {
        type: REMOVE_ONLINE_USER,
        payload: {userID}
    }
}