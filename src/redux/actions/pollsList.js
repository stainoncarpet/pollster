const setPollsCount = () => ({type: "server/SET_POLLS_COUNT"});

const setPollsList = (list) => ({type: "SET_POLLS_LIST", list});

const setSearchQuery = (query) => ({type: "SET_SEARCH_QUERY", query});

const getCurrentPollsList = (page, filterTags, query = null, order) => {
    return async (dispatch, getState) => {
        const validQuery = (query === null || query === undefined) ? getState().pollsList.searchQuery : query;

        dispatch({type: "server/GET_CURRENT_POLLS_LIST", currentPage: page, filterTags: filterTags, query: validQuery, order});
    };
};

const toggleIsFiltersOpen = () => ({type: "TOGGLE_IS_FILTERS_OPEN"});

export {setPollsCount, setPollsList, setSearchQuery, getCurrentPollsList, toggleIsFiltersOpen};