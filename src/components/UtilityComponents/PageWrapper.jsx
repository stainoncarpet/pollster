import React from "react";
import { connect } from "react-redux";
import { Redirect, useLocation} from "react-router-dom";
import { createSelector } from 'reselect';

import ErrorBoundary from "./ErrorBoundary.jsx";
import Footer from "../Footer/Footer.jsx";
import {setRedirect, resetRedirect, showNotification, confirmEmail, proceedWithPasswordReset, setNotification} from "../../redux/actions/actions.js";
import Navbar from "../NavBar/Navbar.jsx";
import {checkTokens} from "../../services/misc.js";

const Modal = React.lazy(() => import("./Modal.jsx"));
const Notification = React.lazy(() => import("./Notification.jsx"));

const PageWrapper = (props) => {
    const location = useLocation();
    const additionalData = { nickname: props.nickname, pwResetToken: location.search.split('=')[1]};

    React.useEffect(() => {
        if (location.pathname === '/poll/create' && (!checkTokens(props.user))){
            props.setRedirect("/login");
        } else if (location.pathname === '/profile'){
            if (props.user) {
                props.redirect ? props.nullifyRedirect() : n => n;
            } else if(!props.user && location.search && location.search.includes("confirm")) {
                props.confirmEmail(location.search);
            } else {
                props.setRedirect("/login");
            }
        } else if (location.pathname.includes('/profile/password-reset')) {
            props.redirect ? props.nullifyRedirect() : n => n;
            if(!props.user && location.search && location.search.includes("token")) { // "token" means valid token
                props.redirect ? props.nullifyRedirect() : n => n;
            } else if(!props.user && location.search && location.search.includes("reset")) { // "reset" comes in enail before typing new password
                props.proceedWithPasswordReset(location.search);
            } else {
                props.redirect ? props.nullifyRedirect() : n => n;
            } 
        } else if (location.pathname === '/polls'){
            props.redirect ? props.nullifyRedirect() : n => n;
        } else if(location.pathname !== '/login' && props.redirect === "/login"){
            props.setRedirect(props.redirect);
        } else {
            props.redirect ? props.nullifyRedirect() : n => n;
        }
    }, [props.notification, props.modalShow]);

    React.useEffect(() => {
        if(props.notificationShow) {
            props.showNotification(false);
            props.setNotification(null, null);
        }
    }, [location.pathname]);

    return props.redirect 
    ? <Redirect to={props.redirect} /> 
    : (<React.Fragment>
            <ErrorBoundary>
                <Navbar />
                {props.notification && <React.Suspense fallback={<p>LOADING</p>}><Notification /></React.Suspense>}
                {React.cloneElement(props.children, additionalData)}
                <Footer />
                {props.modalShow && <React.Suspense fallback={<p>LOADING</p>}><Modal /></React.Suspense>}
            </ErrorBoundary>
    </React.Fragment>);
};

const wrapperStateSelector = createSelector(
    (state) => state.utilities.redirect,
    (state) => state.utilities.notificationText,
    (state) => state.utilities.notificationShow,
    (state) => state.user._id,
    (state) => state.user.nickname,
    (state) => state.utilities.modalShow,
    (redirect, notification, notificationShow, user, nickname, modalShow) => ({redirect, notification, notificationShow, user, nickname, modalShow})
);

const mapStateToProps = (state) => {
    const cachedData = wrapperStateSelector(state);
    return cachedData;
};

const mapDispatchToProps = (dispatch) => {
    return {
        nullifyRedirect: () => dispatch(resetRedirect()),
        setRedirect: (path) => dispatch(setRedirect(path)),
        showNotification: (notificationShow) => dispatch(showNotification(notificationShow)),
        confirmEmail: (token) => dispatch(confirmEmail(token)),
        proceedWithPasswordReset: (query) => dispatch(proceedWithPasswordReset(query)),
        setNotification: (test, type) => dispatch(setNotification(test, type))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageWrapper);