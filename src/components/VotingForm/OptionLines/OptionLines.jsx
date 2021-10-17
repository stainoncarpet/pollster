import React from "react";
import {connect} from "react-redux";

import { setOption } from "../../../redux/actions/actions.js";

const OptionLines = (props) => {
    const handleCheckedChange = (i, mc) => props.setOption(i, mc);

    if (props.options) {
        const lines = props.options.map((option, index) => {
            let isDisabledBecauseOutOfLimit = (props.isSelectedArray.filter((o) => o).length >= props.choiceOptions) && !props.isSelectedArray[index] && props.multichoice;
            let canVote = props.hasAlreadyVoted || !props.userId;

            return (
                <label key={option+index} className="option">
                    <input
                        className="is-medium"
                        name={props.multichoice ? option : "choice"}
                        type={props.multichoice ? "checkbox" : "radio"}
                        value={option}
                        checked={props.isSelectedArray[index]}
                        disabled={canVote || isDisabledBecauseOutOfLimit}
                        style={{cursor: canVote || isDisabledBecauseOutOfLimit ? "not-allowed" : "pointer"}}
                        onChange={() => handleCheckedChange(index, props.multichoice)}
                    />
                    <span className="option__entry is-size-2 is-size-4-mobile is-size-3-tablet">{option} ({props.votes[index]} votes)</span>
                </label>
            );
        });
        return <div>{lines}</div>;
    } else {
        return <p>No data available...</p>
    }
};

const mapStateToProps = (state) => {
    return {
        multichoice: state.poll.multichoice, 
        options: state.poll.options, 
        votes: state.poll.votes, 
        userId: state.user._id, 
        hasAlreadyVoted: state.poll.voters.flat().includes(state.user._id), 
        isSelectedArray: state.poll.selectedOptions, 
        choiceOptions: state.poll.choiceOptions
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setOption: (option, multichoice) => dispatch(setOption(option, multichoice))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionLines);