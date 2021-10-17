import {createStore, applyMiddleware, compose} from "redux";
import createSocketIoMiddleware from 'redux-socket.io';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from "redux-thunk";
import io from 'socket.io-client';

import masterReducer from "./reducers/reducers.js";

const socket = io('/');
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;

let blacklistTransform = createTransform((inboundState, key) => {    
        if (key === 'user') {
            return {
                ...inboundState, 
                authoredPollsList: {
                        page: 1, 
                        list: [], 
                        resultsFound: 0, 
                        isListLoading: true
                }, 
                votedPollsList: {
                        page: 1, 
                        list: [], 
                        resultsFound: 0, 
                        isListLoading: true
                }
            }
        } else {
            return {...inboundState};
        }
    }
);

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['utilities', 'pollsList', 'poll'],
    transforms: [blacklistTransform]
};

const persistedReducer = persistReducer(persistConfig, masterReducer);

const store = createStore(persistedReducer, compose(
    applyMiddleware(socketIoMiddleware, thunk),
    devTools
));

let persistor = persistStore(store);

export {store, persistor, socket};