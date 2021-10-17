import {validateEmail, validatePassword} from "../../services/misc.js";
import { submitCredentials, registerCredentials, submitToken, requestPasswordReset, confirmPasswordReset, setNewPassword } from "../../services/userQueries.js";

import {setIsDataLoading, setRedirect, setNotification} from "./utilities.js";

export const initiateLogIn = (email, password) => {
    return async (dispatch, getState) => {
        !getState().utilities.isDataLoading ? dispatch(setIsDataLoading(true, true)) : n => n;
        try {
            const { user, success, msg } = await submitCredentials(email, password);
            if (user && success) {
                dispatch({type: "SET_USER", user: user});
                dispatch(setNotification("Login successful!", "success"));
            } else {
                dispatch(setNotification(msg, "danger"));
                dispatch(setIsDataLoading(false));
            }
        } catch (error) {
            console.log(error.message);
            dispatch(setIsDataLoading(false));
            dispatch(setNotification("Unsuccessful login attempt", "danger"));
        }
    }
};

export const signUp = (nickname, email, password) => {
    return async (dispatch, getState) => {
        try {
            !getState().utilities.setIsDataLoading ? dispatch(setIsDataLoading(true)) : n => n;

            if (validateEmail(email) && validatePassword(password)) {
                const res = await registerCredentials(nickname, email, password);
                if (res.success) {
                    dispatch(setRedirect("/login"));
                    dispatch(setIsDataLoading(false));
                    dispatch(setNotification("An email confirmation link has been sent to your mailbox!", "success"));
                    return true;
                } else {
                    dispatch(setIsDataLoading(false));
                    dispatch(setNotification(res.msg, "danger"));
                    return false;
                }
            } else {
                dispatch(setIsDataLoading(false));
                dispatch(setNotification("Incorrect password or email format", "danger"));
                return false;
            }
        } catch (error) {
                dispatch(setIsDataLoading(false));
                dispatch(setNotification(error.message, "danger"));
        }
    };
};

export const confirmEmail = (token) => {
    return async (dispatch) => {
        try {
            const res = await submitToken(token.split('=')[1]);
            
            if (res.msg = "OK") {
                dispatch({ type: "SET_USER", user: res.user });
                dispatch(setRedirect('/profile'));
                dispatch(setNotification("Email address confirmed!", "success"));
            } else {
                dispatch(setNotification(res.msg, "danger"));
            }
            return res;
        } catch (error) {
            dispatch(setNotification("Email confirmation failed", "danger"));
        }
    };
};

export const logOut = (msg = "You just logged out", noRedirect = false) => {
    return async (dispatch) => {
        dispatch({type: "LOG_OUT"});
        noRedirect ? n => n : dispatch(setRedirect("/login"));
        dispatch(setNotification(msg, "info"));
    };
};

export const proceedWithPasswordReset = (query) => {
    return async (dispatch) => {
        const result = await confirmPasswordReset(query.split('=')[1]);

        if(result.success){
            dispatch(setRedirect(`/profile/password-reset?token=${result.token}`));
            dispatch(setNotification(result.msg, "success"));
        } else {
            dispatch(setRedirect("/profile/password-reset"));
            dispatch(setNotification(result.msg, "danger"));
        }
    };
};

export const initiatePasswordReset = (email) => {
    return async (dispatch) => {
        const result = await requestPasswordReset(email);

        if(result.success){
            dispatch(setNotification(result.msg, "success"));
        } else {
            dispatch(setNotification(result.msg, "danger"));
        }
    };
};

export const finishPasswordReset = (query, password) => {
    return async (dispatch) => {
        const result = await setNewPassword(query.split('=')[1], password);

        if(result.success){
            dispatch(setRedirect(`/login`));
            dispatch(setNotification(result.msg, "success"));
        } else {
            dispatch(setNotification(result.msg, "danger"));
        }
    };
};

export const resetUserPollsList = (listType) => ({ type: "RESET_USER_POLLS_LIST", listType });

export const setIsListLoading = (listType, isLoading) => ({ type: "SET_IS_USER_LIST_LOADING", listType, isLoading });

export const setUserPollsListPage = (listType, page) => ({ type: "SET_USER_POLLS_LIST_PAGE", listType, page });

export const getUserPollsList = (page, userId, listType) => ({type: "server/GET_USER_POLLS_LIST", currentPage: page, userId, listType });