import React from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import OptionLines from "./OptionLines/OptionLines.jsx";
import { submitVote, getPollStats, resetPoll, setIsDataLoading } from "../../redux/actions/actions.js";
import Spinner from "../UtilityComponents/Spinner.jsx";
import TagsArea from "../PollsList/TagsArea/TagsArea.jsx";
import RemovePollButton from "../UtilityComponents/RemoveItemButton.jsx";
import GoBackButton from "../UtilityComponents/GoBackButton.jsx";
import { sortData } from "../../services/chartHelper.js";

const Chart = React.lazy(() => import("./Chart/Chart.jsx"));
const Tree = React.lazy(() => import("./Tree/Tree.jsx"));

const VotingForm = (props) => {
    let location = useLocation();
    const pathname = location.pathname.split("-");
    const urlPollId = pathname[pathname.length - 1];

    React.useEffect(() => {
        urlPollId.length === 24 && props.getPollStats(urlPollId, props.userId);
        return () => props.resetPoll();
    }, [location]);

    React.useEffect(() => {
        props.pollId && props.setIsDataLoading(false);
    }, [props.pollId]);

    const handleSubmitVote = (e) => {
        e.preventDefault();
        props.submitVote(props.userId, props.pollId, props.selectedOptions);
    };

    const data = React.useMemo(() => sortData(props.options, props.votes), [props.options, props.votes]);

    return (
        <div className="container">
            <h1 className="title is-1 main-title is-size-2-mobile" style={{ visibility: props.isDataLoading ? "hidden" : "inherit" }}>
                <GoBackButton />
                <span>{props.subject}</span>
                {!!props.authorId && props.authorId === props.userId && <RemovePollButton />}
            </h1>
            {props.isDataLoading
                ? <Spinner />
                : (<>
                    {props.tags.length > 0 && <div className="filters"> <TagsArea tags={props.tags} prefix={"Tags: "} /> </div>}
                    <div className="poll-area">
                        <div className="left-area">
                            <form className="vote-form" onSubmit={handleSubmitVote}>
                                <OptionLines />
                                {props.userId
                                    ? props.hasAlreadyVoted
                                        ? <p className="vote-form__submit-button">You already voted!</p>
                                        : (<>
                                            {props.multichoice && <p style={{ color: props.selectedOptions.filter((o) => o).length >= props.maxChoices ? "red" : "green", margin: "10px 0" }}>Max number of choices: {props.maxChoices}</p>}
                                            <button type="submit" className="button is-link vote-form__submit-button vote--button" disabled={!props.selectedOptions.some((opt) => opt === true)}>Vote</button>
                                        </>)
                                    : <p className="vote-form__submit-button"><Link to="/login">Log in</Link> to vote</p>
                                }
                            </form>
                        </div>
                        <div className="right-area">
                            {props.votes.some((el) => el > 0)
                                ? <React.Suspense fallback={<div style={{ textAlign: "center" }}>Loading...</div>}><Chart data={data} /></React.Suspense>
                                : <React.Suspense fallback={<div style={{ textAlign: "center" }}>Loading...</div>}><Tree /></React.Suspense>
                            }
                        </div>
                    </div>
                </>)
            }
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userId: state.user._id,
        pollId: state.poll._id,
        subject: state.poll.subject,
        votes: state.poll.votes,
        options: state.poll.options,
        tags: state.poll.tags,
        hasAlreadyVoted: state.poll.voters.flat().includes(state.user._id),
        selectedOptions: state.poll.selectedOptions,
        isDataLoading: state.utilities.isDataLoading,
        redirect: state.utilities.redirect,
        authorId: state.poll.author && state.poll.author._id,
        maxChoices: state.poll.choiceOptions,
        multichoice: state.poll.multichoice
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        submitVote: (userId, pollId, selectedOptionsArray) => dispatch(submitVote(userId, pollId, selectedOptionsArray)),
        getPollStats: (pid, uid) => dispatch(getPollStats(pid, uid)),
        resetPoll: () => dispatch(resetPoll()),
        setIsDataLoading: (l) => dispatch(setIsDataLoading(l))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(VotingForm);