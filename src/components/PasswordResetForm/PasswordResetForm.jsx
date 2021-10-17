import React from "react";
import { connect } from "react-redux";
import { validateEmail, validatePassword, getPasswordPlaceholders, getInputColor } from "../../services/misc.js";

import { setIsDataLoading, initiatePasswordReset, finishPasswordReset, setNotification } from "../../redux/actions/actions.js";

const PasswordResetForm = (props) => {
  const [email, setEmail] = React.useState("");
  const [pw1, setPw1] = React.useState("");
  const [pw2, setPw2] = React.useState("");
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);

  let emailRef = React.useRef();
  let pw1Ref = React.useRef();
  let pw2Ref = React.useRef();

  React.useEffect(() => {
    const emailValidationResult = validateEmail(email);
    const pw1ValidationResult = validatePassword(pw1);
    const pw2ValidationResult = validatePassword(pw2);

    if (emailRef && emailRef.current) {
      emailRef.current.style.backgroundColor = getInputColor(emailValidationResult);
    } 
    
    if (pw1Ref && pw1Ref.current) {
      pw1Ref.current.style.backgroundColor = getInputColor(pw1ValidationResult);
    } 
    
    if (pw2Ref && pw2Ref.current) {
      pw2Ref.current.style.backgroundColor = getInputColor(pw2ValidationResult);
    }

    if (!props.pwResetToken) {
      setIsButtonDisabled(!emailValidationResult); // step 1
    } else {
      setIsButtonDisabled((pw1 !== pw2) || !pw1ValidationResult); // step 2
    }
  }, [email, pw1, pw2]);

  React.useEffect(() => {
    if (props.isLoading) {
      props.setIsDataLoading(false);
    }

    if (emailRef.current) {
      emailRef.current.focus();
    } else if (pw1Ref.current) {
      pw1Ref.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!props.pwResetToken) {
      props.initiatePasswordReset(email);
      setEmail("");
      emailRef.current.focus();
    } else if (pw1 === pw2) {
      props.finishPasswordReset(location.search, pw1);
    } else {
      props.setNotification("Passwords do not match", "danger");
    }
  };

  const btnClssNm = props.isLoading ? "button is-link is-loading" : "button is-link";

  return (<div className="container">
    <h1 className="title is-1 main-title is-size-2-mobile">Password Reset</h1>
    <form method="POST">
      {!props.pwResetToken
        ? (<div className="field"><div className="control has-text-weight-bold">
          <p>Email:</p>
          <input ref={emailRef} className="input narrow" name="email" value={email} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
        </div></div>)
        : (<div className="field"><div className="control has-text-weight-bold">
          <p>New Password:</p>
          <input ref={pw1Ref} className="input narrow" name="password-1" value={pw1} type="password" placeholder={getPasswordPlaceholders()} onChange={(e) => setPw1(e.target.value)} autoComplete="off" />
        </div>
          <div className="field">
            <p>Re-type New Password:</p>
            <input ref={pw2Ref} className="input narrow" name="password-2" value={pw2} type="password" placeholder={getPasswordPlaceholders()} onChange={(e) => setPw2(e.target.value)} autoComplete="off" />
          </div></div>)
      }
      <div className="field">
        <div className="control has-text-weight-bold">
          <button className={btnClssNm} onClick={handleSubmit} disabled={isButtonDisabled || props.isDataLoading}>Reset Password</button>
        </div>
      </div>
    </form>
  </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.utilities.isDataLoading
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIsDataLoading: () => dispatch(setIsDataLoading(false)),
    initiatePasswordReset: (email) => dispatch(initiatePasswordReset(email)),
    finishPasswordReset: (query, password) => dispatch(finishPasswordReset(query, password)),
    setNotification: (message, type) => dispatch(setNotification(message, type))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetForm);