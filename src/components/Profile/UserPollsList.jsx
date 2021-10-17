import React from "react";

import PollsListItems from "../PollsList/PollsListItems/PollsListItems.jsx";

const UserPollsList = (props) => {
    const {list: userPolls, resultsFound: limit, isListLoading, page} = props.list;
    const {listType, resetListData, setUserPollsListPage} = props;

    const btnClssNm = isListLoading && page !== 1 ? "button is-link is-loading" : "button is-link";

    React.useEffect(() => {
        return () => resetListData(listType);
    }, []);

    return (<> <div> 
                <h2 className="subtitle is-size-2 is-size-3-tablet is-size-3-mobile">
                    {listType === "authored" 
                        ? `Polls you've created to far:`
                        : `Polls you've voted in so far`
                    }
                </h2>
                <PollsListItems pollsList={userPolls} currentPage={page} isLightVersion={true} />
                {userPolls && userPolls.length > 0 
                    && (<> <button className={btnClssNm} onClick={() => setUserPollsListPage(listType, page + 1)} disabled={userPolls.length >= limit}>Load more</button>
                        <p className="is-size-6 is-inline-block user-list-note">{`(displayed ${userPolls.length} out of ${limit})`}</p> </>)
                }
            </div> <hr /> </>);
};

export default React.memo(UserPollsList);
