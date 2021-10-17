const sendPollData = async (subject, options, tags, multiChoice, choiceOptions) => {
    options.length < 3 || (options.length === 3 && options[2].length === 0) ? multiChoice = false : n => n;
    const res = await fetch("/polls/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({subject, options, tags, multiChoice, choiceOptions})
    });
    const body = await res.json();
    return body;
};

const sendVote = async (userId, pollId, selectedOptionsArray) => {
    const res = await fetch("/polls/vote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userId: userId, pollId: pollId, choices: selectedOptionsArray})
    });
    const body = await res.json();
    return body;
};

const getPollsListByPage = async (page, tags) => {
    const res = await fetch(`/polls/get/?page=${page}&tags=${tags}`);
    const body = await res.json();
    return body;
};

const removePollById = async (pollId) => {
    const res = await fetch(`/polls/remove/?pollId=${pollId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const body = await res.json();
    return body;
};

export {sendPollData, sendVote, getPollsListByPage, removePollById};