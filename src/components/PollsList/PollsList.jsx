import React from "react";
import {connect} from "react-redux";

import {resetPollsList, setIsDataLoading, getCurrentPollsList} from "../../redux/actions/actions.js";
import Spinner from "../UtilityComponents/Spinner.jsx";
import TagsArea from "./TagsArea/TagsArea.jsx";
import Pagination from "./Pagination/Pagination.jsx";
import PollsListItems from "./PollsListItems/PollsListItems.jsx";
import {scrollToTop} from "../../services/misc.js";
import SearchBar from "./SearchBar/SearchBar.jsx";
import SortingOrder from "./SortingOrder/SortingOrder.jsx";
import Filters from "./Filters/Filters.jsx";

const PollsList = (props) => {
    React.useEffect(() => {
        !props.isDataLoading ? props.setIsLoading(true) : n => n;
        props.setPollsList(props.currentPage, props.filterTags, props.query, props.order);

        return () => props.resetPollsList();
    }, []);

    const handleSetCurrentPage = (e = null, page, step = 0) => {
        !props.isDataLoading && props.setIsLoading(true);
        e && e.preventDefault();

        if(page) {
            props.setPollsList(page, props.filterTags, props.query, props.order);
        } else {
            props.setPollsList(props.currentPage + step, props.filterTags, props.query, props.order);
        }

        scrollToTop();
    };

    return (<section className="hero">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title title is-1 main-title mb-3 is-size-2-mobile" style={{visibility: props.isDataLoading ? "hidden" : "inherit"}}>
                        {props.existingPolls} polls {(props.filterTags.length > 0 || props.query.length > 0) ? 'found' : 'in total'}
                    </h1>
                    <Filters style={{display: props.isDataLoading ? "none" : "block"}}>
                        <SortingOrder />
                        <TagsArea tags={props.trendingTags} prefix={"Trending: "} />
                        <SearchBar />
                    </Filters>
                    {props.isDataLoading 
                        ? <Spinner />
                        : (<div id="cards-navigation">
                            <PollsListItems currentUser={props.currentUser} isLoading={props.isDataLoading} pollsList={props.displayedPolls} currentPage={props.currentPage} />
                            <Pagination totalPollsCount={props.existingPolls} currentPage={props.currentPage} handleSetCurrentPage={handleSetCurrentPage} />
                        </div>)
                    }
                </div>
            </div>
        </section>
    );
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.user._id, 
        displayedPolls: state.pollsList.displayedPolls, 
        trendingTags: state.pollsList.trendingTags, 
        filterTags: state.pollsList.filterTags, 
        currentPage: state.pollsList.currentPage, 
        existingPolls: state.pollsList.existingPolls, 
        isDataLoading: state.utilities.isDataLoading, 
        query: state.pollsList.searchQuery, 
        order: state.pollsList.sortingOrder
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPollsList: (page, filterTags, query, order) => dispatch(getCurrentPollsList(page, filterTags, query, order)),
        setIsLoading: (isLoading) => dispatch(setIsDataLoading(isLoading)),
        resetPollsList: () => dispatch(resetPollsList())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PollsList);