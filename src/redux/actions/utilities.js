export const setHasError = (hasError) => {
    return async (dispatch, getState) => {

        if(getState().utilities.hasError !== hasError) {
            dispatch({type: "SET_HAS_ERROR", hasError: hasError});
        }
    };
};

export const setRedirect = (redirectPath) => {
    return (dispatch, getState) => {
        dispatch({type: "SET_REDIRECT", redirect: redirectPath});
        getState().utilities.notificationShow ? dispatch(showNotification(false)) : n => n;
    };
};

export const resetRedirect = () => {
    return (dispatch, getState) => {
        getState().utilities.redirect && dispatch({type: "RESET_REDIRECT"});
    };
};

export const setNotification = (notificationText, notificationType) => {
    return (dispatch, getState) => {
        (getState().utilities.notificationText !== notificationText) && dispatch({type: "SET_NOTIFICATION", notificationText: notificationText, notificationType: notificationType});
        
        if(notificationText && notificationType){
            dispatch(showNotification(true));
        }
    };
};

export const showNotification = (notificationShow) => {
    return async (dispatch, getState) => {
        const state = getState();

        if(state.utilities.notificationShow && notificationShow === true){
                dispatch({type: "SHOW_NOTIFICATION", notificationShow: false});
                setTimeout(() => dispatch({type: "SHOW_NOTIFICATION", notificationShow: true}), 1);
        } else if (state.utilities.notificationShow && notificationShow === false) {
                dispatch({type: "SHOW_NOTIFICATION", notificationShow: false});
        } else if (!state.utilities.notificationShow && notificationShow === true) {
                setTimeout(() => dispatch({type: "SHOW_NOTIFICATION", notificationShow: true}), 1);
        }
    };
};

export const setIsDataLoading = (isLoading, reserveSpaceForNotification = false) => {
    return {
        type: "SET_IS_DATA_LOADING",
        isLoading: isLoading,
        reserveSpaceForNotification
    };
}

export const setCurrentPage = (page) => {
    return async (dispatch, getState) => {
        const state = getState();
        if(page !== -1){
            dispatch({type: "SET_CURRENT_PAGE", page: page});
        } else {
            const ceiling = Math.max(Math.ceil(state.pollsList.existingPolls / 10), 1);
            state.pollsList.currentPage > ceiling ? dispatch({type: "SET_CURRENT_PAGE", page: ceiling}) : n => n;
        }
    };
};

export const setTags = (tags) => {
    return {
        type: "SET_TAGS",
        tags: tags
    };
};

export const resetPoll = () => {
    return {
        type: "RESET_POLL"
    };
};

export const resetPollsList = () => {
    return {type: "RESET_POLLS_LIST"}
};

export const showModal = (modalShow) => {
    return {
        type: "SHOW_MODAL",
        modalShow: modalShow
    }
};

export const setRedirectBack = (redirectBack) => {
    return async (dispatch, getState) => {
        if(getState().utilities.redirectBack !== redirectBack){
            dispatch({type: "SET_REDIRECT_BACK", redirectBack: redirectBack});
        }
    };
};

export const setFilterTags = (page, tag) => {
    return async (dispatch, getState) => {
        const state = getState();
        !state.utilities.isLoading ? dispatch(setIsDataLoading(true)) : n => n;

        let newSelectedTagsArray = [];
        state.pollsList.filterTags.includes(tag) 
            ? newSelectedTagsArray = state.pollsList.filterTags.filter((t) => t !== tag) 
            : newSelectedTagsArray = [...state.pollsList.filterTags, tag];

        try {
            dispatch({type: "server/GET_CURRENT_POLLS_LIST", currentPage: page, filterTags: newSelectedTagsArray, query: state.pollsList.searchQuery});

        } catch (error) {
            dispatch({type: "RESET_POLLS_LIST"});
            dispatch(setIsDataLoading(false));
            dispatch(setNotification("Failed to fetch polls", "danger"));
        }
    };
};