import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import chatRoomsReducer from "../reducers/peersReduces";

import { persistReducer, persistCombineReducers, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import peersReducer from './../reducers/peersReduces.js';


const reducers = combineReducers({
    peers: persistReducer({
        key: 'chatRooms',
        storage: storage
    },
    peersReducer),

    //otherReducers: otherNotPersistReducer
})

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

const persistor = persistStore(store);

export { store, persistor };