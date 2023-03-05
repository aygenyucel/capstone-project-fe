import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import peersReducer from '../reducers/peersReducer.js';


const reducers = combineReducers({
    peers: persistReducer({
        key: 'chatRooms',
        storage: storage
    },
    peersReducer),
    //...other reducers:
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