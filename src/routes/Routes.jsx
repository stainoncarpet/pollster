import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import MainPage from "../pages/MainPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import PollsPage from "../pages/PollsPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx"; 
import CreatePollPage from "../pages/CreatePollPage.jsx";
import VotingPage from "../pages/VotingPage.jsx";
import P404 from "../pages/P404.jsx";
import PasswordResetPage from "../pages/PasswordResetPage.jsx";
import useUserAuth from "../custom-hooks/useUserAuth.jsx";

const Routes = () => {
    const user = useUserAuth();

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" render={() => <MainPage />} />
                <Route exact path="/signup" >{user ? <Redirect to={{ pathname: "/profile", state: { referrer: "/signup" } }} /> : <SignupPage />} </Route>
                <Route exact path="/login" >{user ? <Redirect to={{ pathname: "/profile", state: { referrer: "/login" } }} /> : <LoginPage />} </Route>
                <Route exact path="/polls" render={() => <PollsPage />} />
                <Route exact path="/poll/vote/:slug" render={() => <VotingPage />} />
                <Route exact path="/poll/create"> {!user ? <Redirect to={{ pathname: "/login", state: { referrer: "/poll/create" } }} /> : <CreatePollPage />} </Route>
                <Route exact path="/profile"> {!user && !window.location.search ? <Redirect to={{ pathname: "/login", state: { referrer: "/profile" } }} /> : <ProfilePage />}</Route>
                <Route exact path="/profile/password-reset"> {user ? <Redirect to={{ pathname: "/profile", state: { referrer: "/profile/password-reset" } }} /> : <PasswordResetPage />} </Route>
                <Route render={() => <P404 />} />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;