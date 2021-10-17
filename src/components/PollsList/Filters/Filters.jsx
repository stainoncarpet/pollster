import React from 'react';
import {connect} from "react-redux";
import {createSelector} from "reselect";

import {toggleIsFiltersOpen} from "../../../redux/actions/actions.js";

const svg = (
    <React.Fragment>
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 971.986 971.986" xmlSpace="preserve">
            <g><path d="M370.216,459.3c10.2,11.1,15.8,25.6,15.8,40.6v442c0,26.601,32.1,40.101,51.1,21.4l123.3-141.3
            c16.5-19.8,25.6-29.601,25.6-49.2V500c0-15,5.7-29.5,15.8-40.601L955.615,75.5c26.5-28.8,6.101-75.5-33.1-75.5h-873
            c-39.2,0-59.7,46.6-33.1,75.5L370.216,459.3z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
        </svg>
    </React.Fragment>
);

const Filters = (props) => {
    return (<div className="filters" style={props.style}>
            <button className={props.isFiltersOpen ? "button is-outlined mb-3" : "button is-outlined"} onClick={props.toggleIsFiltersOpen}>{props.isFiltersOpen ? "Close" : "Open"} filters {svg}</button>
            {props.isFiltersOpen && props.children}
        </div>);
};

const selector = createSelector(
    (state) => state.pollsList.isFiltersOpen,
    (isFiltersOpen) => ({isFiltersOpen})
);

const mapStateToProps = (state) => {
    const cached = selector(state);
    
    return cached;
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleIsFiltersOpen: () => dispatch(toggleIsFiltersOpen())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);