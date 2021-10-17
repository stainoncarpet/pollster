import React from "react";
import {connect} from "react-redux";

import {showModal, setRedirectBack} from "../../redux/actions/actions.js";

const RemovePollButton = (props) => {
    const handleClick = () => {
        props.redirectBack ? props.setRedirectBack(props.redirectBack) : n => n;
        props.showModal(true);
    };

    return <button type="button" 
                className={props.classNames ? props.classNames : "delete is-large ml-2 button-remove"} 
                onClick={props.fun ? props.fun : handleClick} 
                disabled={props.disabled} 
                style={{cursor: props.disabled ? "not-allowed" : "pointer"}}
    />;
};

const mapDispatchToProps = (dispatch) => {
    return {
        showModal: (show) => dispatch(showModal(show)),
        setRedirectBack: (toRedirect) => dispatch(setRedirectBack(toRedirect))
    };
};

export default connect(null, mapDispatchToProps)(RemovePollButton);