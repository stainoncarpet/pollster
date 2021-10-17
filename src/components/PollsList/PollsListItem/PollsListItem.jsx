import React from "react";
import { Link } from "react-router-dom";
import {connect} from "react-redux";
import dayjs from "dayjs";
import {createSelector} from "reselect";

import generateUri from "../../../services/uriGenerator.js";
import {updateDisplayedPolls} from "../../../redux/actions/actions.js";
import RemovePollButton from "../../UtilityComponents/RemoveItemButton.jsx";

const PollListItem = (props) => {
    const uriObject = {
        pathname: generateUri("poll/vote", props.subject, props.id),
        state: { poll: props.poll }
    };

    let numInLine;

    if (props.currentPage === 1 && props.number < 10) {
        numInLine = props.number.toString();
    } else if (props.currentPage > 1 && props.number < 10) {
        numInLine = `${props.currentPage - 1}${props.number}`;
    } else if (props.currentPage === 1 && props.number === 10) {
        numInLine = "10";
    } else if (props.currentPage > 1 && props.number === 10) {
        numInLine = `${props.currentPage}0`;
    } else {
        numInLine = "?";
    }

    const tags = props.tags.join(", ");
    const tagsJsx = (<p className="subtitle is-6 has-text-weight-light">Tags: {tags}</p>);

    return (
        <div className="card mb-5 swoop" style={{animation: "appear linear", animationDuration: !props.isLightVersion ? `${props.number / 10}s` : '1s' }}>
                    <div className="card-content is-flex flex-wrap">
                        <div className="title minmax-w-50p">
                            <div style={{display: "flex", alignItems: "center"}}>
                            {!props.isLightVersion && <span className="card-position pr-3 is-inline-block">#{numInLine}: </span>}
                            <Link to={uriObject} className="polls-list-item-header">
                                <span style={props.hasCurrentUserVoted && !props.isLightVersion ? { textDecoration: "line-through" } : null}>
                                    {props.subject}
                                </span>
                            </Link>
                            </div>
                            <Link to={uriObject} className="polls-list-item-header">
                                {props.authorId === props.userId && !props.isLightVersion && <RemovePollButton redirectBack={true} />}
                            </Link>
                        </div>
                        <div className="card__meta-info minmax-w-50p">
                            {!props.isLightVersion && <p className="subtitle is-6 has-text-weight-light">Created: {dayjs(props.created).format("MMMM D, YYYY")}</p>}
                            <p className="subtitle is-6 has-text-weight-light">Last vote: {dayjs(props.lastvoted).format("MMMM D, YYYY")}</p>
                            {!props.isLightVersion && <p className="subtitle is-6 has-text-weight-light">Multichoice: {props.multichoice ? "Yes" : "No"}</p>}
                            {props.tags.length > 0 && !props.isLightVersion && tagsJsx}
                        </div>
                    </div>
                    <footer className="card-footer">
                        <p className="card-footer-item">
                            <span className="subtitle is-6 has-text-weight-medium">
                                Votes: {props.votes}
                            </span>
                        </p>
                        {!props.isLightVersion && <p className="card-footer-item">
                            <span className="subtitle is-6 has-text-weight-medium">
                                Author: {props.author}
                            </span>
                        </p>}
                    </footer>
        </div>
    );
};

const selector = createSelector(
    (state) => state.utilities.isDataLoading,
    (state) => state.user._id,
    (isLoading, userId) => ({isLoading, userId})
);

const mapStateToProps = (state) => {
    const cached = selector(state);

    return cached;
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateDisplayedPolls: (pid, updatedVersion) => dispatch(updateDisplayedPolls(pid, updatedVersion))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PollListItem);