import {updateSelectedOptionsArray, shuffleSelectedOptions} from "../../services/misc.js";

const initState = {
        _id: null,
        author: null,
        subject: "",
        options: [],
        selectedOptions: [],
        multichoice: false,
        choiceOptions: 1,
        votes: [],
        voters: [],
        tags: [],
        createdAt: null,
        updatedAt: null
};

const pollReducer = (state = initState, action) => {
    let newSelectedOptions = [];
    
    switch(action.type){
        case "client/GET_POLL_STATS":
            newSelectedOptions = updateSelectedOptionsArray(action.poll.voters, action.userId);
            return {
                        _id: action.poll._id, author: action.poll.author, subject: action.poll.subject, options: action.poll.options, 
                        selectedOptions: action.userId ? newSelectedOptions : state.selectedOptions, multichoice: action.poll.multichoice, choiceOptions: action.poll.choiceOptions,
                        votes: action.poll.votes, voters: action.poll.voters, tags: action.poll.tags, createdAt: action.poll.createdAt, updatedAt: action.poll.updatedAt
            };
        case "client/UPDATE_POLL_STATS":
            // keep logic if user who voted is current user / return old selected options if they are different
            if(action.currentUserId !== action.userId){
                return {
                    _id: action.poll._id, author: action.poll.author, subject: action.poll.subject, options: action.poll.options, 
                    selectedOptions: state.selectedOptions, multichoice: action.poll.multichoice, choiceOptions: action.poll.choiceOptions,
                    votes: action.poll.votes, voters: action.poll.voters, tags: action.poll.tags, createdAt: action.poll.createdAt, updatedAt: action.poll.updatedAt
                };
            } else {
                newSelectedOptions = updateSelectedOptionsArray(action.poll.voters, action.userId);
                return {
                    _id: action.poll._id, author: action.poll.author, subject: action.poll.subject, options: action.poll.options, 
                    selectedOptions: action.userId ? newSelectedOptions : state.selectedOptions, multichoice: action.poll.multichoice, choiceOptions: action.poll.choiceOptions,
                    votes: action.poll.votes, voters: action.poll.voters, tags: action.poll.tags, createdAt: action.poll.createdAt, updatedAt: action.poll.updatedAt
                };
            }
        case "RESET_POLL":
            return initState;
        case "SET_OPTION":
            newSelectedOptions = shuffleSelectedOptions(action.multichoice, state.selectedOptions, action.optionIndex);
            return {...state, selectedOptions: newSelectedOptions};
        default:
            return state;
    }
};

export default pollReducer;