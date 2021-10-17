const initialState = {
    displayedPolls: [],
    trendingTags: [],
    isFiltersOpen: false,
    filterTags: [],
    searchQuery: "",
    sortingOrder: -1,
    currentPage: 1,
    existingPolls: 0
};

const pollsListReducer = (state = initialState, action) => {
    switch (action.type) {
        case "client/SET_POLLS_COUNT":
            if (action.countChange === 1) {
                return { ...state, existingPolls: state.existingPolls + 1 };
            } else if (action.countChange === -1) {
                return state.existingPolls === 0 ? { ...state } : { ...state, existingPolls: state.existingPolls - 1 };
            } else {
                return { ...state, existingPolls: action.count };
            }
        case "SET_POLLS_LIST":
            return { ...state, displayedPolls: action.list };
        case "RESET_POLLS_LIST":
            return { ...initialState, currentPage: state.currentPage, filterTags: state.filterTags, searchQuery: state.searchQuery, sortingOrder: state.sortingOrder, isFiltersOpen: state.isFiltersOpen };
        case "SET_TAGS":
            return { ...state, trendingTags: action.tags };
        case "SET_CURRENT_PAGE":
            return { ...state, currentPage: action.page };
        case "client/UPDATE_DISPLAYED_POLLS":
            let newArray = [];
            for (let i = 0; i < state.displayedPolls.length; i++) {
                state.displayedPolls[i]._id === action.pollId ? newArray.push(action.updatedVersion) : newArray.push(state.displayedPolls[i]);
            }
            return { ...state, displayedPolls: newArray };
        case "client/ADD_NEW_TO_DISPLAYED_POLLS":
            if (RegExp(/\/polls\/?/).test(window.location.pathname)) {
                let newArray = [...state.displayedPolls, action.newPoll];
                return { ...state, displayedPolls: newArray };
            } else {
                return state;
            }
        case "client/REMOVE_FROM_DISPLAYED_POLLS":
            return { ...state, displayedPolls: actionNewDisplayedPolls };
        case "client/GET_CURRENT_POLLS_LIST":
            if (action.totalPollsCount !== state.existingPolls || (JSON.stringify(action.tagsList) !== JSON.stringify(state.trendingTags)) || (JSON.stringify(action.filterTags) !== JSON.stringify(state.filterTags)) || (state.filterTags.length === 0 && (JSON.stringify(action.pollsList) !== JSON.stringify(state.displayedPolls)))) {
                let newCount;
                newCount = state.existingPolls !== action.totalPollsCount ? action.totalPollsCount : state.existingPolls;
                
                const ceiling = Math.ceil(newCount / 10);
                let currentPage;
                if(state.currentPage > ceiling && state.currentPage > 1 && ceiling > 0) {
                    currentPage = ceiling;
                } else {
                    currentPage = action.page;
                }
                return { ...state, displayedPolls: action.pollsList, trendingTags: action.tagsList, filterTags: action.filterTags, currentPage, existingPolls: newCount, sortingOrder: action.order };
            } else if (state.filterTags.length > 0 && (JSON.stringify(action.pollsList) !== JSON.stringify(state.displayedPolls))) {
                let newCount;
                newCount = state.existingPolls !== action.totalPollsCount ? action.totalPollsCount : state.existingPolls;
                
                const ceiling = Math.ceil(newCount / 10);
                let currentPage;
                if(state.currentPage > ceiling && state.currentPage > 1 && ceiling > 0) {
                    currentPage = ceiling;
                } else {
                    currentPage = action.page;
                }

                return { ...state, displayedPolls: action.pollsList, trendingTags: action.tagsList, filterTags: action.filterTags, currentPage, existingPolls: action.totalPollsCount, sortingOrder: action.order };
            } else {
                return state;
            }
        case "SET_FILTER_TAGS":
            return { ...state, filterTags: action.newFilterTags };
        case "SET_SEARCH_QUERY":
            return { ...state, searchQuery: action.query }
        case "TOGGLE_IS_FILTERS_OPEN":
            return { ...state, isFiltersOpen: !state.isFiltersOpen };
        default:
            return state;
    }
};

export default pollsListReducer;