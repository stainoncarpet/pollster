const mongoose = require("mongoose");

const PollModel = require("../models/pollModel.js");
const UserModel = require("../models/userModel.js");

const createPoll = async (subject, options, tags, userEmail, multiChoice = false, choiceOptions) => {
    try {
        const user = await UserModel.findOne({email: userEmail}, "-password");
        if (user){
            const sanitizedOptions = options.filter((o) => !!o);
            const sanitizedTags = tags.filter((o) => !!o).map((o) => o.toLowerCase());
            const sanitizedVotes = new Array(sanitizedOptions.length).fill(0);
            const votersArray = new Array(sanitizedOptions.length).fill([]);

            const poll = await PollModel.create({
                author: mongoose.Types.ObjectId(user._id), 
                subject, 
                multichoice: multiChoice, 
                choiceOptions: multiChoice ? choiceOptions : 1, 
                options: sanitizedOptions, 
                tags: sanitizedTags, 
                votes: sanitizedVotes, 
                voters: votersArray
            });
            const newPollsArray = [...user.polls, poll];
            user.polls = newPollsArray;
            await user.save();
            return {success: true, poll, user}
        } else {
            return {success: false, poll: null}
        }
    } catch (error) {
        console.log("failed to create poll in poll handle", error.message);
        return {success: false, poll: null}
    }
};

const getTrendingTags = async () => {
    const allPolls = await PollModel.find();

    if(allPolls){
        const tags = allPolls.map((poll) => {
            const uniqueVoters = new Set(poll.voters.flat());
            if (uniqueVoters.size > 2) {
                return poll.tags;
            }
        }).flat().filter(n => n);
        return Array.from(new Set(tags));
    } else {
        return [];
    }
};

const getPollsByPage = async (page = 1, selectedTags = null, query = "", order = -1) => {
    const isTagsFilterSet = selectedTags !== null && selectedTags !== "undefined" && selectedTags.length > 0;
    const selectedTagsArray = selectedTags !== null && selectedTags.length > 0 ? selectedTags : null
    const tagsFilter = isTagsFilterSet ? { tags: { $in: selectedTagsArray } } : null;
    const queryFilter = query.length > 0 ? { subject: { $regex: `(.+)?${query}(.+)?`, $options : "i" } } : null;
    
    const combinedFilter = {...tagsFilter, ...queryFilter};

    try {
        const filteredPolls = await PollModel.find(combinedFilter, null).sort({ createdAt: order }).populate({ path: 'author', select: '_id nickname email' });

        const rawPolls = await getRawPollsNumber(combinedFilter);
        const tags = await getTrendingTags();

        if(filteredPolls.length > 0){
            let itemsToSkip;
            const maxPages = Math.ceil(filteredPolls.length / 10);
            maxPages < page ? itemsToSkip = (maxPages - 1) * 10 : itemsToSkip = (page - 1) * 10;

            const pollsSlice = filteredPolls.slice(itemsToSkip, itemsToSkip + 10);

            return {success: true, polls: pollsSlice, tags, filterTags: selectedTags, totalPollsCount: rawPolls.pollsCount, order};
        } else {
            return {success: true, polls: filteredPolls, tags: tags, filterTags: selectedTags, totalPollsCount: rawPolls.pollsCount, order};
        }
    } catch (error) {
        console.log("failed to get polls", error.message);
        return {success: false, polls: null};
    }
};

const getPollsByUser = async (page = 1, userId = null, listType = null) => {
    const userFilter = listType === "authored" ? { author: userId } : { voters: {$elemMatch: {$elemMatch: { $in: [userId] }}} };
    const filteredByUserPolls = await PollModel.find(userFilter, null).sort({ _id: -1 })

    let itemsToSkip;
    const maxPages = Math.ceil(filteredByUserPolls.length / 10);
    maxPages < page ? itemsToSkip = (maxPages - 1) * 10 : itemsToSkip = (page - 1) * 10;

    if(userId && listType === "authored") {
        return {success: true, polls: filteredByUserPolls.slice(itemsToSkip, itemsToSkip + 10), totalPollsCount: filteredByUserPolls.length, listType: listType};
    } else {
        return {success: true, polls: filteredByUserPolls.slice(itemsToSkip, itemsToSkip + 10), totalPollsCount: filteredByUserPolls.length, listType: listType};
    }
};

const getRawPollsNumber = async (filter) => {
    try {
        const rawPolls = await PollModel.find(filter);
        const tags = await getTrendingTags();
        return {allPolls: rawPolls, allTags: tags, pollsCount: rawPolls.length};
    } catch (error) {
        console.log("failed to get polls", error.message);
        return {allPolls: null, pollsCount: null};
    }
};

const getPollById = async (pollId) => {
    try {
        let poll;
        poll = await PollModel.findOne({ _id: pollId }).populate({ path: 'author', select: '_id nickname email' });
        
        if(poll){
            return {success: true, poll};
        } else {
            return {success: true, poll: null};
        }
    } catch (error) {
        console.log("failed to get poll", error.message.message);
        return {success: false, poll: null};
    }
};

const registerVote = async (userId, pollId, choices) => {
    try {
        const poll = await PollModel.findById({ _id: pollId });
        const voter = await UserModel.findById({ _id: userId });
        const author = await UserModel.findById({ _id: poll.author }, {_id: 1, nickname: 1, email: 1});

        if (poll.voters.flat().includes(userId) || !voter.isConfirmed) {
            throw new Error("the user has already voted or their email is not confirmed");
        } else if (choices.filter((choice) => choice).length > poll.choiceOptions) {
            throw new Error("too many choices submitted");
        } else {
            for (let i = 0; i < poll.options.length; i++) {
                for (let j = 0; j < choices.length; j++) {
                    if (i === j && choices[j] === true) {
                        poll.votes = [...poll.votes.slice(0, i), (poll.votes[i] + 1), ...poll.votes.slice(i + 1)];
                        poll.voters = [...poll.voters.slice(0, i), [...poll.voters[i], voter._id], ...poll.voters.slice(i + 1)];;
                        await poll.save();
                    }
                }
            }
            let updatedPoll = await poll.save();
            updatedPoll = {...updatedPoll, author: author };
            return { success: true, poll: {...updatedPoll._doc, author: updatedPoll.author} };
        }
    } catch (error) {
        console.log("failed to register vote", error.message);
        return { success: false, poll };
    }
};

const removePoll = async (pollId) => {
    try {
        await PollModel.deleteOne({ _id: pollId });
        await UserModel.findOneAndUpdate({polls: { "$in" : [pollId]}}, { $pullAll: { polls: [pollId] } });

        return { success: true, msg: "Poll has been deleted" };
    } catch (error) {
        return { success: false };
    }
};

module.exports = {createPoll, getPollsByPage, registerVote, getPollById, getRawPollsNumber, removePoll, getPollsByUser};