import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import CountUp from 'react-countup';
import { createSelector } from "reselect";

import { setPollsCount } from "../../redux/actions/actions.js";

const WelcomeWindow = (props) => {
  React.useEffect(() => {
    props.setPollsCount();
  }, []);

  const logButtons = (
    <React.Fragment>
      <NavLink to="/signup" className="button is-link signup" style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>Sign up</NavLink>
      <NavLink to="/login" className="button is-light">Log in</NavLink>
    </React.Fragment>
  );

  return (
    <div className="background">
      <div className="container centered" id="window">
        <h1 className="title is-1 is-size-2-mobile is-size-2-tablet">Welcome to Pollster! It's nice to see you!</h1>
        <p className="tag is-1 is-family-monospace is-medium">Ask and see what people think</p>
        {!!props.pollsCount
          ? <p className="count">Active Polls: <b><CountUp start={0} end={props.pollsCount} duration={2} /> </b></p>
          : <p className="count">Be the first to ask!</p>
        }
        <div className="buttons">
          <NavLink to="/polls" className="button is-info">Peek in</NavLink>
          {!props.userId && logButtons}
        </div>
      </div>
    </div>
  );
};

const selector = createSelector(
  (state) => state.user._id,
  (state) => state.pollsList.existingPolls,
  (userId, pollsCount) => ({ userId, pollsCount })
);

const mapStateToProps = (state) => {
  const cached = selector(state);

  return cached;
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPollsCount: () => dispatch(setPollsCount())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeWindow);