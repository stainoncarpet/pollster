const router = require("express").Router();

const {createUser, logInUser, confirmUser, requestPasswordReset, confirmPasswordReset, setNewPassword, updateAuth} = require("./handles/userHandle.js");
const {createPoll, getRawPollsNumber, getPollsByPage, registerVote, removePoll} = require("./handles/pollHandle.js");
const {auth} = require("../data/utils/auth.js");
const {io} = require("./ws.js");

// Poll routes
router.get("/polls/get/", async(req, res) => {
    try {
        const pollsArray = await getPollsByPage(req.query.page, req.query.tags);
        res.status(200).send({success: true, msg: "OK", pollsList: pollsArray.polls, tagsList: pollsArray.tags, totalPollsCount: pollsArray.totalPollsCount});
    } catch (error) {
        console.log("failed to get polls by page", error.message);
        res.status(400).send({success: false, msg: "failed to fetch polls"});
    }
});

router.post("/polls/create", auth, async (req, res) => {
    try {
        const result = await createPoll(req.body.subject, req.body.options, req.body.tags, req.userEmail, req.body.multiChoice, req.body.choiceOptions);
        const rawPollsNumber = await getRawPollsNumber();
        //io.emit('action', {type:'client/SET_POLLS_COUNT', count: rawPollsNumber.pollsCount, tags: req.body.tags, countChange: 1}); // most likely not needed
        io.emit("newPollCreated", result.poll._id, req.body.subject, req.userId, rawPollsNumber.pollsCount, req.body.tags, 1 );
        io.emit("updatePollsList", rawPollsNumber.allPolls, rawPollsNumber.allTags);
        res.status(200).send(result);
    } catch (error) {
        console.log("failed to create poll", error.message);
        res.status(400).send({success: false, msg: "failed to create poll"});
    }
});

router.post("/polls/vote", auth, async (req, res) => {
    try {
        const result = await registerVote(req.body.userId, req.body.pollId, req.body.choices);
        io.emit('voteCounted', result.poll._id, req.body.userId);
        const pollsArray = await getPollsByPage();
        
        io.emit("updatePollsList", pollsArray.polls, pollsArray.tags);
        res.status(200).send(result);
    } catch (error) {
        console.log("failed to register vote", error.message);
        res.status(401).send({success: false, msg: "Failed to register vote"});
    }
});

router.delete("/polls/remove", auth, async (req, res) => {
    try {
        const result = await removePoll(req.query.pollId);
        const r = await getRawPollsNumber();
        io.emit('action', {type:'client/SET_POLLS_COUNT', count: r.pollsCount, tags: req.body.tags, countChange: -1});
        io.emit("pollRemoved", req.query.pollId);
        io.emit("updatePollsList", r.allPolls, r.allTags);
        res.status(200).send({success: true, msg: result.msg});
    } catch (error) {
        res.status(401).send({success: false, msg: "Failed to remove poll"});
    }
});

// User routes
router.post("/user/create", async (req, res) => {
    try {
        const result = await createUser(req.body);
        if(result){
            res.status(200).send({ success: true, user: result });
        } else {
            res.status(406).send({ success: false, msg: "Email address already registered" });
        } 
    } catch (error) {
        console.log("failed to create user in route", error.message);
    }
});
  
router.post("/user/login", async (req, res) => {
    try {
        const loginAttemptResult = await logInUser(req.body);
        if (loginAttemptResult.match && loginAttemptResult.user) {
            res.status(200).send({ success: true, msg: "Login successful", user: loginAttemptResult.user });
        } else if (loginAttemptResult.match && !loginAttemptResult.user) {
            res.status(401).send({ success: true, msg: "Your email address is unconfirmed. We sent you another confirmation link in case you lost your current one.", user: null });
        } else {
            res.status(200).send({ success: false, msg: "Incorrect email or password", user: null });
        }
    } catch (error) {
        console.log("login attempt failed", error.message);
        res.status(200).send({ success: false, msg: "An error occurred", user: null });
    }
});

router.post("/user/confirm", async (req, res) => {
    try {
        const result = await confirmUser(req.query.t);

        if(result.user) {
            res.status(200).send({success: true, msg: "OK", user: result.user});
        } else throw new Error("error inside user/confirm");
    } catch (error) {
        console.log("user confrirmation failed", error.message);
        res.status(401).send({success: false, msg: "this confirmation link has expired, but a new link has been sent to your mailbox!"});
    }
});

router.post("/user/password-reset/step-1", async (req, res) => {
    try {
        const result = await requestPasswordReset(req.query.email);

        if(result.success) {
            res.status(200).send({success: result.success, msg: result.msg});
        } else {
            res.status(200).send({success: false, msg: result.msg});
        }
    } catch (error) {
        console.log("Failed to reset password", error.message);
        res.status(400).send({success: false, msg: "Failed to reset password"});
    }
});

router.post("/user/password-reset/step-2", async (req, res) => {
    try {
        const result = await confirmPasswordReset(req.query.token);

        if(result.success) {
            res.status(200).send({success: result.success, msg: result.msg, token: result.token});
        } else {
            res.status(200).send({success: false, msg: result.msg});
        }
    } catch (error) {
        console.log("Failed to reset password", error.message);
        res.status(400).send({success: false, msg: error.toString().split(":")[1], token: null});
    }
});

router.post("/user/password-reset/step-3", async (req, res) => {
    try {
        const result = await setNewPassword(req.query.token, req.body.password);
        
        if(result.success) {
            res.status(200).send({success: result.success, msg: result.msg});
        } else {
            res.status(200).send({success: false, msg: result.msg});
        }
    } catch (error) {
        console.log("Failed to reset password", error.message);
        res.status(400).send({success: false, msg: error.toString().split(":")[1]});
    }
});

router.post("/user/update-auth", async (req, res) => {
    try {
        const [authToken, refreshToken] = await updateAuth(req.cookies);
        if (!authToken || !refreshToken) {
            res.status(200).send({success: true, msg: "tokens reset", authToken: null, refreshToken: null});
        } else {
            res.status(200).send({success: true, msg: "new tokens", authToken, refreshToken});
        }
    } catch (error) {
        console.log("Failed to update tokens: ", error.message);
        res.status(400).send({success: false, msg: "failed to update tokens", authToken: null, refreshToken: null});
    }   
});

module.exports = {endpoints: router};