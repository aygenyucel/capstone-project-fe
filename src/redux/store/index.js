import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import peersReducer from '../reducers/peersReducer.js';
import profileReducer from './../reducers/profileReducer';


const reducers = combineReducers({
    peersReducer: persistReducer({
        key: 'chatRooms',
        storage: storage
    },
    peersReducer),
    profileReducer: profileReducer
})

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        //because the stream object is non-serializable value
        serializableCheck: false
    })
})

const persistor = persistStore(store);

export { store, persistor };