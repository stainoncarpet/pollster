import {sendVote} from "../../services/pollQueries.js";
import {sendPollData, removePollById} from "../../services/pollQueries.js";
import getUri from "../../services/uriGenerator.js";

import {setIsDataLoading, setNotification, showNotification, showModal, setRedirect} from "./utilities.js";
import {logOut} from "./user.js";
import {checkTokens} from "../../services/misc.js"

export const submitNewPoll = (subject, options, tags, multiChoice, choiceOptions) => {
    return async (dispatch, getState) => {
        const state = getState();

        checkTokens(state.user._id, dispatch, logOut, "Your previous log-in has expired - please log in again");
        !state.utilities.isDataLoading && dispatch(setIsDataLoading(true));

        try {
            if(options.length + 1 !== new Set([...options, subject]).size){
                dispatch(setNotification("Two or more lines contain the same values!", "danger"));
            } else {
                state.utilities.notificationShow && dispatch(showNotification(false));
                const res = await sendPollData(subject, options, tags, multiChoice, choiceOptions);
                const pollUri = getUri("poll/vote", res.poll.subject, res.poll._id);

                dispatch(setPoll(res.poll));
                dispatch(setRedirect(pollUri));
                dispatch(setNotification("Poll created successfully!", "success"));
            }
        } catch (error) {
            dispatch(setNotification("Failed to create new poll", "danger"));
        } finally {
            dispatch(setIsDataLoading(false));
        }
    };
};

export const submitVote = (userId, pollId, selectedOptionsArray) => {
    return async (dispatch, getState) => {
        const state = getState();
        
        try {
            dispatch(setIsDataLoading(true));
            await sendVote(userId, pollId, selectedOptionsArray);
            (state.utilities.notificationShow === true && state.utilities.notificationText) && dispatch(showNotification(false));
            dispatch(setNotification("Your vote has been counted!", "success"));
        } catch (e) {
            if (state.utilities.notificationShow === true && state.utilities.notificationText){
                dispatch(showNotification(false));
            }
            dispatch(setNotification("Your vote wasn't counted for some reason", "danger"));
            dispatch(showNotification(true));
        } finally {
            dispatch(setIsDataLoading(false));
        }
    };
};

export const getPollStats = (pollId, userId) => {
    return async (dispatch, getState) => {
        !getState().utilities.setIsDataLoading ? dispatch(setIsDataLoading(true)) : n => n;

        dispatch({type: "server/GET_POLL_STATS", pollId: pollId, userId: userId});
    };
}; 

export const setOption = (optionIndex, multichoice) => ({type: "SET_OPTION", optionIndex, multichoice});

export const setPoll = (poll) => ({type: "SET_POLL", poll});

export const removePoll = (pollId) => {
    return async (dispatch, getState) => {
        const state = getState();
        !state.utilities.isDataLoading ? dispatch(setIsDataLoading(true)) : n => n;

        dispatch(showModal(false));
        await removePollById(pollId);
    };
};