import React from 'react';
import {connect} from "react-redux";
import {createSelector} from "reselect";

import {getCurrentPollsList, setIsDataLoading} from "../../../redux/actions/actions.js";

const SortingOrder = (props) => {
    const handleReverseOrder = (e) => {
        !props.isDataLoading ? props.setIsLoading(true) : n => n;
        props.setPollsList(props.currentPage, props.filterTags, props.query, e.target.value);
    };

    return (<div className="select is-normal ml-3">
                <select name="sorting-order-selector" id="sorting-order-selector" onChange={handleReverseOrder}>
                    <option value="-1">Newest to oldest</option>
                    <option value="1">Oldest to newest</option>
                </select>
            </div>)
};

const selector = createSelector(
    (state) => state.pollsList.filterTags,
    (state) => state.pollsList.currentPage,
    (state) => state.pollsList.searchQuery,
    (state) => state.pollsList.sortingOrder,
    (state) => state.utilities.isDataLoading,
    (filterTags, currentPage, query, order, isDataLoading) => ({filterTags, currentPage, query, order, isDataLoading})
);

const mapStateToProps = (state) => {
    const cached = selector(state);
    
    return cached;
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPollsList: (page, filterTags, query, order) => dispatch(getCurrentPollsList(page, filterTags, query, order)),
        setIsLoading: (isLoading) => dispatch(setIsDataLoading(isLoading))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SortingOrder);
