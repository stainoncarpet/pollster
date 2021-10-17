import React from "react";
import {connect} from "react-redux";
import {createSelector} from "reselect";

import {setFilterTags} from "../../../redux/actions/actions.js";

const TagsArea = (props) => {
  const handleTagClick = (e, tag) => {
    e.target.classList.value.includes("is-success") ? e.target.classList.value = "tag is-info" : e.target.classList.value = e.target.classList.value + " is-success";
    props.setFilterTags(props.page, tag);
  };

  const tags = props.tags.map((tag) =>  {
    let tagClassList;
    let isGeneralView;
    
    if (!!props.filterTags && !!props.prefix) {
      tagClassList = props.filterTags.includes(tag) ? `tag is-info is-success` : "tag is-info";
      isGeneralView = props.prefix.includes("Trending");
    } else {
      tagClassList = "tag is-info";
      isGeneralView = false;
    }

    return (<div key={tag} className="control">
        <div className="tags has-addons">
          <a className={tagClassList} onClick={isGeneralView ? (e) => handleTagClick(e, tag) : null} style={{cursor: isGeneralView ? "pointer" : "unset"}}>#{tag}</a>
        </div>
      </div>)
  });

  return (
    <div id="tags-area" className="field is-grouped is-grouped-multiline">{tags}</div>
  );
};

const selector = createSelector(
  (state) => state.pollsList.filterTags,
  (state) => state.pollsList.currentPage,
  (filterTags, page) => ({filterTags, page})
);

const mapStateToProps = (state) => {
  const cached = selector(state);

  return cached;
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTags: (page, tagInQuestion) => dispatch(setFilterTags(page, tagInQuestion))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TagsArea);