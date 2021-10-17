import React from "react";
import {useDispatch, connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import UserPollsList from "./UserPollsList.jsx";
import Spinner from "../UtilityComponents/Spinner.jsx";
import { resetUserPollsList, setUserPollsListPage, getUserPollsList, resetRedirect } from "../../redux/actions/actions.js";

const Profile = ({list1, list2, nickname, userId}) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getUserPollsList(list1.page, userId, "authored"));
    }, [list1.page]);

    React.useEffect(() => {
        dispatch(getUserPollsList(list2.page, userId, "voted"));
    }, [list2.page]);

    const style = {visibility: list1.isListLoading || list2.isListLoading ? "hidden" : "inherit"};

    const resetListData = React.useCallback((listType) => {dispatch(resetUserPollsList(listType))}, [dispatch]);
    const setPage = React.useCallback((listType, page) => {dispatch(setUserPollsListPage(listType, page))}, [dispatch]);

    return (<section className="hero">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title title is-1 main-title mb-3 is-size-2-mobile" style={style}>Hello, {nickname || "User"}!</h1>
                    {((list1.isListLoading & list1.page === 1) || (list2.isListLoading && list2.page === 1)) 
                        ? <Spinner />
                        : (<>
                            <UserPollsList 
                                list={list1}
                                listType="authored" 
                                resetListData={resetListData}
                                setUserPollsListPage={setPage} />
                            <UserPollsList 
                                list={list2}
                                listType="voted" 
                                resetListData={resetListData}
                                setUserPollsListPage={setPage} />
                        </>)}
                </div>
            </div>
        </section>);
};

const mapStateToProps = createStructuredSelector({
    list1: (state) => state.user.authoredPollsList,
    list2: (state) => state.user.votedPollsList,
    nickname: (state) => state.user.nickname,
    userId: (state) => state.user._id
})

export default connect(mapStateToProps)(Profile);