import { applyMiddleware, combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createStateSyncMiddleware } from "redux-state-sync";
import thunk from "redux-thunk";
import peersReducer from '../reducers/peersReducer.js';
import profileReducer from './../reducers/profileReducer.js';
import roomsReducer from './../reducers/roomsReducer.js';

// import {
//     FLUSH,
//     REHYDRATE,
//     PAUSE,
//     PERSIST,
//     PURGE,
//     REGISTER,
// } from 'redux-persist';


const reducers = combineReducers({
    peersReducer: persistReducer({
        key: 'peers',
        storage: storage
    },
    peersReducer),
    profileReducer: profileReducer,
    roomsReducer: persistReducer({
        key: 'rooms',
        storage: storage
    }, roomsReducer)
})

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        //we disable the serializable check because the stream object is non-serializable value
        serializableCheck: false,
        // ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        
    })
})

const persistor = persistStore(store);

export { store, persistor };