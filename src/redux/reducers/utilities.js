const initialState = {
    notificationText: null,
    notificationType: null,
    notificationShow: false,
    isDataLoading: true,
    hasError: false,
    redirect: null,
    redirectBack: false,
    modalShow: false
};

const utilitiesReducer = (state = initialState, action) => {
    switch(action.type){
        case "SET_IS_DATA_LOADING": 
            if (action.isLoading && state.notificationShow && !action.reserveSpaceForNotification) {
                return {...state, isDataLoading: action.isLoading, notificationShow: false, notificationText: null};
            } else {
                return {...state, isDataLoading: action.isLoading};
            }
        case "SET_HAS_ERROR": 
            return {...state, hasError: action.hasError};
        case "SET_REDIRECT": 
            return {...state, redirect: action.redirect};
        case "RESET_REDIRECT": 
            return {...state, redirect: null};
        case "SET_NOTIFICATION": 
            return {...state, notificationText: action.notificationText, notificationType: action.notificationType};
        case "SHOW_NOTIFICATION": 
            return {...state, notificationShow: action.notificationShow};
        case "SHOW_MODAL": 
            return {...state, modalShow: action.modalShow};
        case "SET_REDIRECT_BACK": 
            return {...state, redirectBack: action.redirectBack};
        default: 
            return state;
    }
};

export default utilitiesReducer;