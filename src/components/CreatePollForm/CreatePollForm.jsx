import React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import PollLine from "./PollLine/PollLine.jsx";
import { setIsDataLoading, submitNewPoll, setNotification, showNotification } from "../../redux/actions/actions.js";
import RemoveItemButton from "../UtilityComponents/RemoveItemButton.jsx";
import GoBackButton from "../UtilityComponents/GoBackButton.jsx";
import Spinner from "../UtilityComponents/Spinner.jsx";
import { sanitizeForTitle } from "../../services/uriGenerator.js";
import { getInputColor, filterOutIncorrectCharacters } from "../../services/misc.js"

const CreatePollForm = (props) => {
    const [options, setPollOptions] = React.useState([""]);
    const [tags, setPollTags] = React.useState([""]);
    const [step, setStep] = React.useState(1); // either 1 or 2
    const [subject, setPollSubject] = React.useState("");
    const [multiChoice, setMultiChoice] = React.useState(false);
    const [choiceOptions, setChoiceOptions] = React.useState(2);

    let qRef = React.useRef();

    React.useEffect(() => {
        if (props.isDataLoading) {
            props.setIsDataLoading(false);
        }

        if (qRef && qRef.current && options.length < 2) {
            qRef.current.focus();
        }
    }, []);

    React.useEffect(() => {
        const optionInputs = document.querySelectorAll("input.input");

        if (optionInputs.length > 0) {
            optionInputs[optionInputs.length - 1].focus();
        }
    }, [options.length, tags.length, step]);

    const addNewLine = React.useCallback((lineType) => lineType === "Option" ? setPollOptions([...options, ""]) : setPollTags([...tags, ""]), [options, tags]);

    const handleLineContentChange = React.useCallback((index, newValue, type, lastItem = false) => {
        let newArray = [];
        let subjectedArray = type === "Option" ? options : tags;

        for (let i = 0; i < subjectedArray.length; i++) {
            if((i !== index) || (newValue !== "" && !filterOutIncorrectCharacters(newValue))) {
                newArray.push(subjectedArray[i]);
            } else if (newValue !== "" && !lastItem) {
                newArray.push(newValue);
            } else if (newValue === "" && lastItem) {
                newArray.push("");
            }
        }
        if (newArray.length === 0) {
            type === "Option" ? setPollOptions([""]) : setPollTags([""]);
        } else {
            type === "Option" ? setPollOptions(newArray) : setPollTags(newArray);
        }
    }, [options, tags]);

    const handleSubjectChange = (e) => {
        if (e.key == 'Enter') {e.preventDefault(); document.querySelectorAll("input.input")[1].focus();}
        if (filterOutIncorrectCharacters(e.target.value)) setPollSubject(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (subject.length > 120 || options.some((o) => o.length > 60) || tags.some((t) => t.length > 60)) {
            props.setNotification("Some of the items you specified are too lengthy - try using shorter ones", "danger");
        } else {
            props.submitNewPoll(sanitizeForTitle(subject), options, tags, multiChoice, choiceOptions);
        }
    };

    const eraseFormInputs = (e) => {
        e.preventDefault();
        setPollSubject("");
        setPollOptions([""]);
        setPollTags([""]);
        setMultiChoice(false);
        setChoiceOptions(2);
        setStep(1);
        qRef.current.focus();
    };

    const switchOptionsTags = (e) => {
        e.preventDefault();
        step === 1 ? setStep(2) : setStep(1);
    };

    const pollLines = (itemsArray, lineType) => itemsArray.map((item, ind) => {
        let buttonPolarity = true;
        let onlyItem = itemsArray.length === 1;
        let lastItem = ind === itemsArray.length - 1;

        if (item === "" && onlyItem) {
            buttonPolarity = true;
        } else if (item !== "" && onlyItem) {
            buttonPolarity = true;
        } else if (item === "" && !onlyItem) {
            buttonPolarity = true;
        } else if (item !== "" && !onlyItem && lastItem) {
            buttonPolarity = true;
        } else {
            buttonPolarity = false;
        }

        return <PollLine
            lineType={lineType}
            lineContent={item}
            buttonPolarity={buttonPolarity}
            onlyOption={onlyItem}
            lastItem={lastItem}
            optionNumber={ind + 1}
            key={ind}
            handleLineContentChange={handleLineContentChange}
            handleAddNewLine={addNewLine}
        />
    });

    const handleChoiceOptionsSelect = (e) => {
        setChoiceOptions(e.target.value);
    };

    React.useEffect(() => {
        if (qRef && qRef.current) qRef.current.style.backgroundColor = getInputColor(subject.length <= 120, "from subject");
    }, [subject]);

    return (<div className="container">
        <h1 className="title is-1 main-title is-size-2-mobile" style={{ visibility: props.isDataLoading ? "hidden" : "inherit" }}>
            <GoBackButton />
            <span>Create New Poll: {step === 1 ? "add options" : "add tags"}</span>
        </h1>
        {props.isDataLoading
            ? <Spinner />
            : (<form>
                <div className="field">
                    <label className="label is-size-5">Subject</label>
                    <div className="control with-button">
                        <input
                            className="form__subject input is-size-5"
                            ref={qRef}
                            value={subject}
                            type="text"
                            onChange={handleSubjectChange}
                            onKeyPress={handleSubjectChange}
                            placeholder="What is the question? (max. 120 chars)"
                        />
                        <RemoveItemButton fun={eraseFormInputs} classNames={`button-remove button-cross delete is-large ml-2`} disabled={subject.length === 0} />
                    </div>
                </div>
                {step === 1
                    ? (subject || options.length > 0 && options[0].length > 0) && pollLines(options, "Option")
                    : (subject || tags.length > 0 && tags[0].length > 0) && pollLines(tags, "Tag")
                }
                <div className="form__buttons field is-grouped">
                    <div className="poll-settings">
                        {(options.length > 2 && options[2].length > 0 && step === 1) &&
                            <label className="checkbox multiple">
                                <span style={{ fontSize: "20px" }}>Enable multiple choices: </span>
                                <input type="checkbox" className="multiple" checked={multiChoice} onChange={() => setMultiChoice(!multiChoice)} style={{ display: "inline-block", marginLeft: "1rem" }} />
                            </label>
                        }
                        {multiChoice && step === 1 && (options.length > 2 && options[2].length > 0) && (
                            <div className="select is-info mb-4">
                                <label htmlFor="choice-options" style={{ fontSize: "20px", marginTop: "2px", display: "inline-block" }}>Max number of choices: </label>
                                <select id="choice-options" name="choice-options" value={choiceOptions} style={{ display: "inline-block", marginLeft: "1rem" }} onChange={(e) => handleChoiceOptionsSelect(e)}>
                                    {options.map((o, i) => (i > 0 && i <= options.length && options[i].length > 0) && <option key={o + i} value={i + 1}>{i + 1}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="control">
                        <button className="button is-link" onClick={handleSubmit} disabled={!subject || options.length < 2 || (options.length === 2 && options[1] === '')}>Submit</button>
                        <button className="button is-normal" onClick={switchOptionsTags} disabled={!subject || options.length < 2 || (options.length === 2 && options[1] === '')}>{step === 1 ? "Add Tags" : "Tweak Options"}</button>
                    </div>
                </div>
            </form>)
        }
    </div>
    );
};

const selector = createSelector(
    (state) => state.utilities.isDataLoading,
    (isDataLoading) => ({ isDataLoading })
);

const mapStateToProps = (state) => {
    const cached = selector(state);

    return cached;
};

const mapDispatchToProps = (dispatch) => {
    return {
        setIsDataLoading: (isLoading) => dispatch(setIsDataLoading(isLoading)),
        submitNewPoll: (subject, options, tags, multiChoice, choiceOptions) => dispatch(submitNewPoll(subject, options, tags, multiChoice, choiceOptions)),
        setNotification: (text, type) => dispatch(setNotification(text, type)),
        showNotification: (show) => dispatch(showNotification(show))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePollForm);