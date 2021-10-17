import React from 'react';
import {useHistory} from "react-router-dom";

const GoBackButton = () => {
    const history = useHistory();

    return <button className="button is-light is-medium is-size-6-mobile is-pulled-left mt-2" onClick={() => history.push("/polls")}>Go to polls</button>;
}

export default GoBackButton;