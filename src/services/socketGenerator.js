import {store, socket} from "../redux/store.js";
import {setRedirect, setNotification, setIsDataLoading} from "../redux/actions/actions.js";
import generateUri from "../services/uriGenerator.js";

const bind = () => {
    socket.on("voteCounted", (pollId, voterId) => {
        const state = store.getState();

        const displayedPolls = state.pollsList.displayedPolls;
        const authoredPollsList = state.user.authoredPollsList.list;
        const votedPollsList = state.user.votedPollsList.list;

        const ids = [...displayedPolls.map((poll) => poll._id), ...authoredPollsList.map((poll) => poll._id), ...votedPollsList.map((poll) => poll._id)];

        const isPollDisplayedInArray = ids.includes(pollId);
        const isPollDisplayedInFull = state.poll._id === pollId;
        
        if (isPollDisplayedInFull) {
            store.dispatch({type: "server/UPDATE_POLL_STATS", pollId: pollId, voterId: voterId, currentUserId: state.user._id});
        } else if (isPollDisplayedInArray) {
            store.dispatch({type: "server/UPDATE_DISPLAYED_POLLS", pollId: pollId});
        }
    });

    socket.on("newPollCreated", (pollId, subject, userId, rawPollsNumber, tags, countChange) => {
        const state = store.getState();

        const condition1 = (state.pollsList.filterTags.length > 0 && state.pollsList.filterTags.some((filterTag) => tags.includes(filterTag)));
        const condition2 = (state.pollsList.searchQuery.length > 0 && subject.includes(state.pollsList.searchQuery));
        
        if(window.location.pathname === '/' || condition1 || condition2) {
            store.dispatch({type: 'client/SET_POLLS_COUNT', count: rawPollsNumber, tags, countChange});
        }
        
        if(state.pollsList.displayedPolls.length < 10) {
            store.dispatch({type: "server/ADD_NEW_TO_DISPLAYED_POLLS", pollId: pollId, filterTags: state.pollsList.filterTags, searchQuery: state.pollsList.searchQuery});
        } else {
            store.dispatch({type: "server/GET_CURRENT_POLLS_LIST", currentPage: state.pollsList.currentPage, filterTags: state.pollsList.filterTags, query: state.pollsList.searchQuery, order: state.pollsList.sortingOrder});
        }
        const link = generateUri("poll/vote", subject, pollId);

        if(state.user._id !== userId) {
            store.dispatch(setNotification(`Somebody added a poll!${link.toLowerCase()}`, "info"));
        } 
    });

    socket.on("pollRemoved", (pollId) => {
        const state = store.getState();

        !state.utilities.isDataLoading ? store.dispatch(setIsDataLoading(true)) : n => n;

        store.dispatch({type: "server/REMOVE_FROM_DISPLAYED_POLLS", currentPage: state.pollsList.currentPage, filterTags: state.pollsList.filterTags, query: state.pollsList.searchQuery, order: state.pollsList.sortingOrder});

        if (state.poll._id === pollId){
            store.dispatch(setRedirect("/polls"));
            store.dispatch(setNotification("This poll has been removed", "warning"));
        }
    });

    socket.on("connect", () => {
        const state = store.getState();

        if (RegExp(/\/poll\/vote\/[a-z0-9A-Z-?]+/).test(window.location.pathname)) {
            store.dispatch({type: "server/GET_POLL_STATS", pollId: state.poll._id, currentBrowserPollVersion: state.poll});
        }
    });
};

export default bind;