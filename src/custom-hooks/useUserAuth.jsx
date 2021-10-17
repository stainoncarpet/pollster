import React from 'react';
import { useDispatch, useSelector } from "react-redux";

import { logOut } from "../redux/actions/actions.js";
import {checkTokens} from "../services/misc.js";
import {updateAuth} from "../services/userQueries.js";

const useTokenUpdate = () => {
    const user = useSelector((state) => state.user._id);
    const dispatch = useDispatch();
    const regularVisit = !window.location.href.includes("profile?confirm") && !document.location.href.includes("profile?confirm")

    const engageAuth = async () => {
        checkTokens(user, dispatch, logOut);
        const body = await updateAuth();
        
        if(!body || !body.authToken || !body.refreshToken) {
            dispatch(logOut(null, true))
        } else {
            document.cookie = `auth_token=${body.authToken}; max-age=${parseInt(AUTH_TOKEN_LIFESPAN_IN_DAYS) * ONE_DAY_IN_SECONDS}; path=/`;
            document.cookie = `refresh_token=${body.refreshToken}; max-age=${parseInt(REFRESH_TOKEN_LIFESPAN_IN_DAYS) * ONE_DAY_IN_SECONDS}; path=/`;
        }
    };

    React.useEffect(() => {
        regularVisit && checkTokens(user, dispatch, logOut);

        let refreshPolling = null;

        if (user) {
            refreshPolling = setInterval(engageAuth, REFRESH_TOKEN_POLLING_TIME_IN_MILISECONDS);
        }

        return () => refreshPolling && clearInterval(refreshPolling);
    }, [user]);

    return user;
}

export default useTokenUpdate;
