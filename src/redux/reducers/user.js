const initState = {
    _id: null,
    nickname: null,
    email: null,
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
};

const userReducer = (state = initState, action) => {
    switch(action.type){
        case "SET_USER":
            action.user.authToken ? document.cookie = `auth_token=${action.user.authToken}; max-age=${parseInt(AUTH_TOKEN_LIFESPAN_IN_DAYS) * ONE_DAY_IN_SECONDS}; path=/` : n => n;
            action.user.refreshToken ? document.cookie = `refresh_token=${action.user.refreshToken}; max-age=${parseInt(REFRESH_TOKEN_LIFESPAN_IN_DAYS) * ONE_DAY_IN_SECONDS}; path=/` : n => n;
            return {...state, _id: action.user._id, nickname: action.user.nickname, email: action.user.email};
        case "client/GET_USER_POLLS_LIST":
            const newBatch = action.pollsList;
            const oldBatch = action.listType === "authored" ? state.authoredPollsList.list : state.votedPollsList.list;
            const batch = [...oldBatch, ...newBatch];
    
            return action.listType === "authored" 
                ? {...state, authoredPollsList: {page: action.page, list: batch, resultsFound: action.totalPollsCount, isListLoading: false}} 
                : {...state, votedPollsList: {page: action.page, list: batch, resultsFound: action.totalPollsCount, isListLoading: false}}
            ;
        case 'client/UPDATE_DISPLAYED_POLLS':
            if(state.authoredPollsList.list.length === 0 && state.votedPollsList.list.length === 0) return state;

            const isIncludedInAuthoredPollsList = state.authoredPollsList.list.map((p) => p._id).includes(action.pollId);
            const isIncludedInVotedPollsList = state.votedPollsList.list.map((p) => p._id).includes(action.pollId);
    
            if(isIncludedInAuthoredPollsList && isIncludedInVotedPollsList) {
                let newAuthoredPollsList = [];
                let newVotedPollsList = [];

                for(let i = 0; i < state.authoredPollsList.list.length; i++){
                    state.authoredPollsList.list[i]._id === action.pollId ? newAuthoredPollsList.push({...action.updatedVersion, author: action.updatedVersion.author._id}) : newAuthoredPollsList.push(state.authoredPollsList.list[i]);
                }
    
                for(let i = 0; i < state.votedPollsList.list.length; i++){
                    state.votedPollsList.list[i]._id === action.pollId ? newVotedPollsList.push({...action.updatedVersion, author: action.updatedVersion.author._id}) : newVotedPollsList.push(state.votedPollsList.list[i]);
                }
    
                return {...state, authoredPollsList: {...state.authoredPollsList, list: newAuthoredPollsList, resultsFound: state.authoredPollsList.resultsFound, isListLoading: false}, 
                                votedPollsList: {...state.votedPollsList, list: newVotedPollsList, resultsFound: state.votedPollsList.resultsFound, isListLoading: false }}
            } else if (isIncludedInAuthoredPollsList) {
                let newAuthoredPollsList = [];
    
                for(let i = 0; i < state.authoredPollsList.list.length; i++){
                    state.authoredPollsList.list[i]._id === action.pollId ? newAuthoredPollsList.push({...action.updatedVersion, author: action.updatedVersion.author._id}) : newAuthoredPollsList.push(state.authoredPollsList.list[i]);
                }
                return {...state, authoredPollsList: {...state.authoredPollsList, list: newAuthoredPollsList, resultsFound: state.authoredPollsList.resultsFound, isListLoading: false}}
            } else if (isIncludedInVotedPollsList) {
                let newVotedPollsList = [];
    
                for(let i = 0; i < state.votedPollsList.list.length; i++){
                    state.votedPollsList.list[i]._id === action.pollId ? newVotedPollsList.push({...action.updatedVersion, author: action.updatedVersion.author._id}) : newVotedPollsList.push(state.votedPollsList.list[i]);
                }
    
                return {...state, votedPollsList: {...state.votedPollsList, list: newVotedPollsList, resultsFound: state.votedPollsList.resultsFound, isListLoading: false }}
            } else {
                return state;
            }
        case "LOG_OUT":
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            return initState;
        case "RESET_USER_POLLS_LIST":
            return action.listType === "authored" 
                ? {...state, authoredPollsList: initState.authoredPollsList} 
                : {...state, votedPollsList: initState.authoredPollsList}
            ;
        case "SET_IS_USER_LIST_LOADING":
            return action.listType === "authored" 
                ? {...state, authoredPollsList: {...state.authoredPollsList, isListLoading: action.isLoading}} 
                : {...state, votedPollsList: {...state.votedPollsList, isListLoading: action.isLoading}}
            ;
        case "SET_USER_POLLS_LIST_PAGE":
            return action.listType === "authored" 
                ? {...state, authoredPollsList: {...state.authoredPollsList, page: action.page, isListLoading: true}}
                : {...state, votedPollsList: {...state.votedPollsList, page: action.page, isListLoading: true}} 
            ;
        default: 
            return state;
    }
};

export default userReducer;