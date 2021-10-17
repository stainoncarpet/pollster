import React from "react";
import {connect} from "react-redux";
import Fade from 'react-reveal/Fade';
import {Link} from "react-router-dom";
import {createSelector} from "reselect";

import {setNotification, showNotification} from "../../redux/actions/actions.js";

const Notification = (props) => {
    const handleCloseClick = () => {
        if(props.notificationShow){
            props.setNotification(null, null);
            props.showNotification(false);
        }
    };

    let msgHeader;

    if(props.notificationType === "success"){
        msgHeader = "Success!";
    } else if (props.notificationType === "danger") {
        msgHeader = "Oops!";
    } else {
        msgHeader = "Alright!";
    }

    let msgText;
    let msgLink;
    if(props.notificationText.includes("/poll/vote")) {
        const ind = props.notificationText.indexOf('\/');
        msgText = props.notificationText.slice(0, ind)
        msgLink = props.notificationText.slice(ind, props.notificationText.length);
    } else {
        msgText = props.notificationText
    }

    return (
        <div className="container" id="notification-bar">
            <Fade left opposite when={props.notificationShow && !!props.notificationText} collapse>
                <div>
                    <article className={`message is-${props.notificationType}`}>
                        <div className="message-header">
                            <p>{msgHeader}</p>
                            <button className="delete" aria-label="delete" onClick={handleCloseClick}></button>
                        </div>
                        <div className="message-body pl-4"><p>{msgText}</p>{msgLink && <Link to={msgLink}>Go there</Link>}</div>
                    </article>
                </div>
            </Fade>
        </div>
    );
};

const selector = createSelector(
    (state) => state.utilities.notificationText,
    (state) => state.utilities.notificationType,
    (state) => state.utilities.notificationShow,
    (state) => state.utilities.isDataLoading, 
    (notificationText, notificationType, notificationShow, isLoading) => ({notificationText, notificationType, notificationShow, isLoading}) 
);

const mapStateToProps = (state) => {
    const cached = selector(state);

    return cached;
};

const mapDispatchToProps = (dispatch) => {
    return {
        setNotification: (notificationText, notificationType) => dispatch(setNotification(notificationText, notificationType)),
        showNotification: (notificationShow) => dispatch(showNotification(notificationShow))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);