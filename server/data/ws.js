const {getPollById, getRawPollsNumber, getPollsByPage, getPollsByUser} = require("./handles/pollHandle.js");
const {io} = require("../server.js");

const lauchWebsocketServer = () => {
    io.on('connection', (client) => {
        // REDUX CLIENT
        client.on('action', (action) => {
            // SET_POLLS_COUNT
            if(action.type === 'server/SET_POLLS_COUNT'){
                getRawPollsNumber()
                    .then((res) => {
                        client.emit('action', {type:'client/SET_POLLS_COUNT', count: res.pollsCount});
                        client.emit('action', {type:'SET_IS_DATA_LOADING', isLoading: false});
                    })
                    .catch((e) => console.log(e.message));
            // UPDATE_DISPLAYED_POLLS
            } else if (action.type === 'server/GET_CURRENT_POLLS_LIST') {
                console.log(action.currentPage);
                getPollsByPage(action.currentPage, action.filterTags, action.query, action.order)
                    .then((result) => {
                        client.emit('action', {
                            type:'client/GET_CURRENT_POLLS_LIST', 
                            pollsList: result.polls, 
                            tagsList: result.tags, 
                            filterTags: result.filterTags,
                            totalPollsCount: result.totalPollsCount,
                            order: result.order,
                            page: action.currentPage
                        });
                        client.emit('action', {type: "SET_IS_DATA_LOADING", isLoading: false });
                    })
                    .catch((e) => {
                        console.log(e.message);
                    });
            // GET_USER_POLLS_LIST
            } else if (action.type === "server/GET_USER_POLLS_LIST") {
                getPollsByUser(action.currentPage, action.userId, action.listType)
                    .then((result) => {
                        client.emit('action', {
                            type:'client/GET_USER_POLLS_LIST', 
                            page: action.currentPage,
                            pollsList: result.polls, 
                            totalPollsCount: result.totalPollsCount,
                            listType: action.listType
                        });
                        client.emit('action', {type: "SET_IS_DATA_LOADING", isLoading: false });
                    })
                    .catch((e) => {
                        console.log(e.message);
                    });
            // UPDATE_DISPLAYED_POLLS
            } else if (action.type === 'server/UPDATE_DISPLAYED_POLLS') {
                getPollById(action.pollId)
                    .then((result) => {
                        client.emit('action', {type:'client/UPDATE_DISPLAYED_POLLS', pollId: result.poll.id, updatedVersion: result.poll});
                    })
                    .catch((e) => console.log(e.message));
            // GET_VOTED_POLLS_LIST    
            } else if (action.type === 'server/ADD_NEW_TO_DISPLAYED_POLLS') { // Only fires if there are filters in place and / otherwise server/GET_CURRENT_POLLS_LIST is fired
                getPollById(action.pollId)
                    .then((result) => {
                        const selectedTagsAndPollTagsMatch = (action.filterTags.length === 0 || action.filterTags.some((filterTag) => result.poll.tags.includes(filterTag)));
                        const queryFoundInSubject = result.poll.subject.includes(action.searchQuery)

                        if(selectedTagsAndPollTagsMatch && queryFoundInSubject){
                            client.emit('action', {type:'client/ADD_NEW_TO_DISPLAYED_POLLS', newPoll: result.poll});
                            console.log("filters match - emitting action");
                        } else {
                            console.log("not emitting");
                        }
                        console.log(`${action.filterTags} in actionfiltertags || ${result.poll.tags} in resultpolltags`);
                        console.log("---", selectedTagsAndPollTagsMatch, queryFoundInSubject);
                    })
                    .catch((e) => console.log(e.message));
            // REMOVE_FROM_DISPLAYED_POLLS
            } else if (action.type === 'server/REMOVE_FROM_DISPLAYED_POLLS') {
                getPollsByPage(action.currentPage, action.filterTags, action.query, action.order)
                    .then((result) => {
                        client.emit('action', {
                            type:'client/GET_CURRENT_POLLS_LIST', 
                            pollsList: result.polls, 
                            tagsList: result.tags,
                            filterTags: result.filterTags,
                            totalPollsCount: result.totalPollsCount,
                            order: result.order,
                            page: action.currentPage
                        });
                        client.emit('action', {type: "SET_IS_DATA_LOADING", isLoading: false });
                    })
                    .catch((e) => console.log(e.message));
            // GET_POLL_STATS 
            } else if (action.type === 'server/GET_POLL_STATS') {
                if(!action.pollId){
                    return;
                }
                getPollById(action.pollId)
                    .then((result) => {
                        if(result.poll){
                            const shouldUpdateUIAfterReconnect = action.currentBrowserPollVersion && (JSON.stringify(action.currentBrowserPollVersion) !== JSON.stringify(result.poll));
                            const shouldFetchFromScratch = !action.currentBrowserPollVersion;
                            
                            if (shouldFetchFromScratch || shouldUpdateUIAfterReconnect){
                                client.emit('action', {type:'client/GET_POLL_STATS', userId: action.userId, poll: result.poll});
                            }
                        } else {
                            client.emit('action', {type:'SET_REDIRECT', redirect: "/polls"});
                            client.emit('action', {type:'SET_NOTIFICATION', notificationText: "The poll you requested does not exist!", notificationType: "danger"});
                            client.emit('action', {type:'SHOW_NOTIFICATION', notificationShow: true});
                        }
                    })
                    .catch((e) => console.log(e.message));
            // UPDATE_POLL_STATS
            } else if (action.type === 'server/UPDATE_POLL_STATS') {
                getPollById(action.pollId)
                    .then((result) => {
                        client.emit('action', {type:'client/UPDATE_POLL_STATS', voterId: action.voterId, currentUserId: action.currentUserId, poll: result.poll}); // user means voter
                    })
                    .catch((e) => console.log(e.message));
            }
        });

        console.log("global namespace connected");

        client.on('disconnect', () => {
            console.log("global client disconnected");
        });
    });
};

module.exports = { lauchWebsocketServer, io};