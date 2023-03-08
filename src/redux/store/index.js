import {  combineReducers, configureStore} from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import peersReducer from '../reducers/peersReducer.js';
import profileReducer from './../reducers/profileReducer.js';
import roomsReducer from './../reducers/roomsReducer.js';

const reducers = combineReducers({
    peersReducer: persistReducer({
        key: 'peers',
        storage: storage
    },
    peersReducer),
    profileReducer: persistReducer({
        key: 'profile',
        storage: storage
    },
    profileReducer),
    roomsReducer: persistReducer({
        key: 'rooms',
        storage: storage
    }, roomsReducer)
})

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        //we disable the serializable check because the stream object is non-serializable value
        serializableCheck: false
    })
})

const persistor = persistStore(store);

export { store, persistor };