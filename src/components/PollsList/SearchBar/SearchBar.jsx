import React from 'react';
import {connect} from "react-redux";
import {createSelector} from "reselect";

import {setSearchQuery, getCurrentPollsList, setIsDataLoading} from "../../../redux/actions/actions.js";
import RemoveButton from "../../UtilityComponents/RemoveItemButton.jsx";

const SearchBar = (props) => {
    const ref = React.useRef();
    let delayedFetchTimeout = React.useRef();

    React.useLayoutEffect(() => {
        (props.searchQuery.length > 0 && !props.isLoading) && ref.current.focus();
    }, [props.searchQuery, props.isLoading]);

    const handleSetSearchQuery = (e) => {
        props.setSearchQuery(e.target.value);

        if(delayedFetchTimeout.current){
            clearTimeout(delayedFetchTimeout.current);
            delayedFetchTimeout.current = null;
        }

        delayedFetchTimeout.current = setTimeout(() => {
            props.setIsDataLoading(true);
            props.setPollsList(props.currentPage, props.filterTags, null); // query is injected inside action
            delayedFetchTimeout.current = null;
        }, 500);
    };

    const handleClearSearchQuery = () => {
        props.setIsDataLoading(true);
        props.setPollsList(props.currentPage, props.filterTags, "", props.order);
        props.setSearchQuery("");
    };

    return (
        <div className="search-bar">
            <div className="control">
                <input ref={ref} className="input" type="text" placeholder="Search by poll title" value={props.searchQuery} onChange={handleSetSearchQuery} />
                <RemoveButton classNames="clear-search-query delete is-large ml-2 button-remove" fun={handleClearSearchQuery} disabled={props.searchQuery.length === 0} />
            </div>
        </div>
    );
};

const selector = createSelector(
    (state) => state.pollsList.searchQuery,
    (state) => state.pollsList.filterTags,
    (state) => state.pollsList.currentPage,
    (state) => state.pollsList.sortingOrder,
    (state) => state.utilities.isDataLoading,
    (searchQuery, filterTags, currentPage, order, isLoading) => ({searchQuery, filterTags, currentPage, order, isLoading})
);

const mapStateToProps = (state) => {
    const cached = selector(state);

    return cached;
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSearchQuery: (q) => dispatch(setSearchQuery(q)),
        setPollsList: (page, filterTags, query, order) => dispatch(getCurrentPollsList(page, filterTags, query, order)),
        setIsDataLoading: (isLoading) => dispatch(setIsDataLoading(isLoading))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);