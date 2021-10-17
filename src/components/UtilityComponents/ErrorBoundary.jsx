import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {createSelector} from "reselect";

import {setHasError} from "../../redux/actions/actions.js";
const ErrorImage = React.lazy(() => import("./ErrorImage.jsx"));

class ErrorBoundary extends React.Component {
    componentDidCatch(error, info) {
        this.props.setHasError(true);
    }

    componentWillUnmount() {
        this.props.setHasError(false);
    }

    render() {
        if (this.props.hasError) {
            return (
                <div className="error">
                    <React.Suspense fallback={<div></div>}><ErrorImage /></React.Suspense>
                    <div className="error-text">
                        <h3 className="title is-3 is-spaced">Oops, something just broke! Please let us know what it was.</h3>
                        <h4 className="title is-4 is-spaced">Or you can try from the <Link to="/">beginning</Link>.</h4>
                    </div>
                </div>
            );
        } else {
            return this.props.children;
        }
    }
}

const selector = createSelector(
    (state) => state.utilities.hasError,
    (hasError) => ({hasError})
);

const mapStateToProps = (state) => {
    const cached = selector(state);

    return cached;
};

const mapDispatchToProps = (dispatch) => {
    return {
        setHasError: (hasError) => dispatch(setHasError(hasError))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);