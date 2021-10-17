import React from "react";
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {createSelector} from "reselect";

import {logOut} from "../../../redux/actions/actions.js";

const UserControls = (props) => {
    const unauthState = (
        <React.Fragment>
            <NavLink to="/signup" className="button is-link">Sign up</NavLink>
            <NavLink to="/login" className="button is-light">Log in</NavLink>
        </React.Fragment>
    );
    
    const authState = (
        <React.Fragment>
            <span>Logged in as <br /> <b><NavLink to="/profile" style={{cursor: "pointer"}}>{props.user.email}</NavLink></b></span>
            <button className="button is-info is-outlined" onClick={() => props.logOut()}>Log out</button>
        </React.Fragment>
    );
    
    return (
        <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {!!props.user.email ? authState : unauthState}
              </div>
            </div>
        </div>
    );
};

const selector = createSelector(
    (state) => state.user,
    (user) => ({user})
);

const mapStateToProps = (state) => {
    const cached = selector(state);

    return cached;
};

const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => dispatch(logOut())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserControls);