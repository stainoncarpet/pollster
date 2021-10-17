import React from "react";
import { connect } from "react-redux";
import {Link} from "react-router-dom";

import { setIsDataLoading, initiateLogIn } from "../../redux/actions/actions.js";
import {validateEmail, validatePassword, getInputColor} from "../../services/misc.js";

const LoginForm = (props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);

  let emailRef = React.useRef();
  let passwordRef = React.useRef();

  React.useEffect(() => {
    const emailValidationResult = validateEmail(email);
    const passwordValidationResult = validatePassword(password);

    if (emailRef && emailRef.current) {
      emailRef.current.style.backgroundColor = getInputColor(emailValidationResult);
    } 
    
    if (passwordRef && passwordRef.current) {
      passwordRef.current.style.backgroundColor = getInputColor(passwordValidationResult);
    }

    setIsButtonDisabled(!emailValidationResult || !passwordValidationResult);
  }, [email, password]);

  React.useEffect(() => {
    if(props.isLoading){
      props.setIsDataLoading(false);
    }

    if(emailRef.current){
      emailRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.initiateLogIn(email, password);
  };

  const btnClssNm = props.isLoading ? "button is-link is-loading" : "button is-link";

  return (<div className="container">
          <h1 className="title is-1 main-title is-size-2-mobile">Log In</h1>
          <form method="POST">
            <div className="field">
              <div className="control has-text-weight-bold">
                <p>Email:</p>
                <input ref={emailRef} className="input narrow" name="email" value={email} type="email" placeholder="Email" onChange={handleChange} autoComplete="off" />
              </div>
            </div>
            <div className="field">
              <div className="control has-text-weight-bold">
                <p>Password:</p>
                <input ref={passwordRef} className="input narrow" name="password" value={password} type="password" placeholder="Password" onChange={handleChange} autoComplete="off" />
              </div>
            </div>
            <Link to="/profile/password-reset"><p className="card-footer-item" style={{justifyContent: "left", paddingLeft: "0"}}>Forgot your password?</p></Link>
            <div className="field">
              <div className="control has-text-weight-bold">
                <button className={btnClssNm} onClick={handleSubmit} disabled={isButtonDisabled || props.isLoading}>Login</button>
              </div>
            </div>
          </form>
        </div>
    );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.utilities.isDataLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initiateLogIn: (email, password) => dispatch(initiateLogIn(email, password)),
    setIsDataLoading: () => dispatch(setIsDataLoading(false))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);