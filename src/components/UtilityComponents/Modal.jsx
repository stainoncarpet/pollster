import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import Flip from 'react-reveal/Flip';
import { createSelector } from "reselect";

import { showModal, removePoll, setRedirect, setRedirectBack } from "../../redux/actions/actions.js";

const Modal = (props) => {
  const el = document.createElement('div');
  let location = useLocation();

  React.useEffect(() => {
    const portal = document.getElementById("portal");
    portal.appendChild(el);
    props.modalShow ? document.body.style.overflow = "hidden" : document.body.style.overflow = "unset";

    return () => {
      props.modalShow ? handleClose() : n => n;
      portal.removeChild(el);

      if (props.redirectBack) {
        props.setRedirect("/polls");
        props.setRedirectBack(false);
      }
    }
  }, [props.modalShow, props.redirectBack]);

  const handleClose = () => {
    props.showModal(false);
    document.body.style.overflow = "unset";
  };

  const handleYes = () => {
    const pathname = location.pathname.split("-");
    const urlPollId = pathname[pathname.length - 1];
    props.removePoll(urlPollId);
  };

  return ReactDOM.createPortal(
    <Flip bottom when={props.modalShow}>
      <div>
        <div className={props.modalShow ? "modal is-active" : "modal"}>
          <div className="modal-background" onClick={handleClose}></div>
          <div className="modal-content">
            <div className="box">
              <article className="media modal-window">
                <p className="has-text-weight-bold is-size-4">Are you sure?</p>
                <div className="field is-grouped">
                  <p className="control">
                    <button type="button" className="button is-primary is-medium is-fullwidth" onClick={handleYes}>Yes</button>
                  </p>
                  <p className="control">
                    <button type="button" className="button is-danger is-medium is-fullwidth" onClick={handleClose}>No</button>
                  </p>
                </div>
              </article>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={handleClose} />
        </div>
      </div>
    </Flip>, el
  );
};

const selector = createSelector(
  (state) => state.utilities.modalShow,
  (state) => state.utilities.redirectBack,
  (modalShow, redirectBack) => ({ modalShow, redirectBack })
);

const mapStateToProps = (state) => {
  const cached = selector(state);

  return cached;
};

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (show) => dispatch(showModal(show)),
    removePoll: (pollId) => dispatch(removePoll(pollId)),
    setRedirect: (path) => dispatch(setRedirect(path)),
    setRedirectBack: (toRedirect) => dispatch(setRedirectBack(toRedirect))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);