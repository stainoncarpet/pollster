import React from "react";
import {connect} from "react-redux";

import WelcomeWindow from "../components/WelcomeWindow/WelcomeWindow.jsx";
import ErrorBoundary from "../components/UtilityComponents/ErrorBoundary.jsx";
import {setNotification, showNotification} from "../redux/actions/actions.js";
import {createSelector} from "reselect";

const MainPage = (props) => {
    React.useEffect(() => {
        props.notificationShow ? props.showNotification(false) : n => n;
        props.notification ? props.resetNotification() : n => n;
    }, []);

    return (
        <ErrorBoundary>
            <WelcomeWindow />
        </ErrorBoundary>
    );
};

const mainSelector = createSelector(
    (state) => state.utilities.notificationText,
    (state) => state.utilities.notificationShow,
    (notification, notificationShow) => ({notification, notificationShow})
);

const mapStateToProps = (state) => {
    const cached = mainSelector(state);

    return cached;
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetNotification: () => dispatch(setNotification(null, null)),
        showNotification: (notificationShow) => dispatch(showNotification(notificationShow))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);