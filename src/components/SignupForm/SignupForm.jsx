import React from "react";
import { connect } from "react-redux";

import { setIsDataLoading, signUp } from "../../redux/actions/actions.js";
import { validateEmail, validateNickname, validatePassword, getPasswordPlaceholders, getInputColor } from "../../services/misc.js";
import Spinner from "../UtilityComponents/Spinner.jsx";

const SignupForm = (props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);

  let nickRef = React.useRef();
  let emailRef = React.useRef();
  let passwordRef = React.useRef();

  React.useEffect(() => {
    const nicknameValidationResult = validateNickname(nickname);
    const emailValidationResult = validateEmail(email);
    const passwordValidationResult = validatePassword(password);

    if (nickRef && nickRef.current) {
      nickRef.current.style.backgroundColor = getInputColor(nicknameValidationResult);
    } 
    
    if (emailRef && emailRef.current) {
      emailRef.current.style.backgroundColor = getInputColor(emailValidationResult);
    } 
    
    if (passwordRef && passwordRef.current) {
      passwordRef.current.style.backgroundColor = getInputColor(passwordValidationResult);
    }

    setIsButtonDisabled(!(nicknameValidationResult && emailValidationResult && passwordValidationResult));
  }, [email, password, nickname]);

  React.useEffect(() => {
    props.isDataLoading && props.setIsDataLoading(false);

    if (nickRef.current) {
      nickRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "nickname") {
      setNickname(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const registrationSuccessful = props.signUp(nickname, email, password);
    !registrationSuccessful ? clearInputs() : n => n;
  };

  const clearInputs = () => {
    setEmail("");
    setNickname("");
    setPassword("");
  };

  const btnClssNm = props.isLoading ? "button is-link is-loading" : "button is-link";

  return (<div className="container">
    <h1 className="title is-1 main-title is-size-2-mobile" style={{ visibility: props.isDataLoading ? "hidden" : "inherit" }}>Sign Up</h1>
      <form method="POST">
        <div className="field">
          <div className="control has-text-weight-bold">
            <p>Choose a nickname:</p>
            <input
              className="input narrow"
              name="nickname"
              value={nickname}
              type="text"
              placeholder="Letters or digits"
              onChange={handleChange}
              autoComplete="off"
              ref={nickRef}
            />
          </div>
        </div>
        <div className="field">
          <div className="control has-text-weight-bold">
            <p>Specify your email address:</p>
            <input
              className="input narrow"
              name="email"
              value={email}
              type="email"
              placeholder="Your go-to email"
              onChange={handleChange}
              autoComplete="off"
              ref={emailRef}
            />
          </div>
        </div>
        <div className="field">
          <div className="control has-text-weight-bold">
            <p>Make up a password:</p>
            <input
              className="input narrow"
              name="password"
              value={password}
              type="password"
              placeholder={getPasswordPlaceholders()}
              onChange={handleChange}
              autoComplete="off"
              ref={passwordRef}
            />
          </div>
        </div>
        <div className="field">
          <div className="control has-text-weight-bold">
            <button className={btnClssNm} onClick={handleSubmit} disabled={isButtonDisabled || props.isDataLoading}>Submit</button>
          </div>
        </div>
      </form>
  </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isDataLoading: state.utilities.isDataLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIsDataLoading: (isLoading) => dispatch(setIsDataLoading(isLoading)),
    signUp: (nickname, email, password) => dispatch(signUp(nickname, email, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);