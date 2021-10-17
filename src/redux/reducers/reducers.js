import { combineReducers } from 'redux';

import userReducer from "./user.js";
import pollReducer from './poll.js';
import pollsListReducer from "./pollsList.js";
import utilitiesReducer from './utilities.js';

const masterReducer = combineReducers({
    user: userReducer,
    poll: pollReducer,
    pollsList: pollsListReducer,
    utilities: utilitiesReducer
});

export default masterReducer;