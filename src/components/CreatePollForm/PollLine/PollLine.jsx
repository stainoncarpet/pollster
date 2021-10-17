import React from "react";

import {getInputColor} from "../../../services/misc.js"

const PollLine = (props) => {
    const pRef = React.useRef();

    const handleButtonClick = (e) => {
        e.preventDefault();
        if (props.lineContent && props.buttonPolarity){
            props.handleAddNewLine(props.lineType);
        } else {
            props.handleLineContentChange(props.optionNumber - 1, "", props.lineType);
        }
    };

    const handleLineContentChange = (e) => {
        if (e.key == 'Enter') {
            e.target.value === "" ? e.preventDefault() : handleButtonClick(e);
        } else if (e.target.value !== ""){
            props.handleLineContentChange(props.optionNumber - 1, e.target.value, props.lineType);
        } else if(e.target.value === "" && props.lastItem) {
            props.handleLineContentChange(props.optionNumber - 1, "", props.lineType, props.lastItem);
        } else {
            props.handleLineContentChange(props.optionNumber - 1, "", props.lineType);
        }
    };

    React.useEffect(() => {
        if(pRef && pRef.current) pRef.current.style.backgroundColor = getInputColor(props.lineContent.length <= 60, "lineContent");
    }, [props.lineContent]);

    return (
        <div className="field">
            <label className="label option is-size-5">{props.lineType} {props.optionNumber}:</label>
            <div className="control with-button">
                <input 
                    ref={pRef}
                    className="input option-input is-size-5"
                    onChange={handleLineContentChange} 
                    onKeyPress={handleLineContentChange} 
                    value={props.lineContent} 
                    type="text" 
                    placeholder={`${props.lineType} ${props.optionNumber} (max. 60 chars)`}
                />
                {props.buttonPolarity 
                    ? <button className="button is-success" onClick={handleButtonClick} disabled={!props.lineContent}>+</button>
                    : <button className="button is-danger" onClick={handleButtonClick} disabled={props.onlyOption}>-</button>
                }
            </div>
        </div>
    );
}

export default PollLine;