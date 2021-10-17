import React from "react";
import {NavLink} from "react-router-dom";

import UserControls from "./UserControls/UserControls.jsx";

const Navbar = () => {
  const burgerRef = React.useRef();
  const menuRef = React.useRef();
    
    const handleClick = () => {
      burgerRef.current.classList.toggle("is-active");
      menuRef.current.classList.toggle("is-active");
    };

  return (
    <React.Fragment>
      <nav className="navbar main-shadow" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <NavLink to="/" className="navbar-item brand-link">
            <span className="title">Pollster</span>
          </NavLink>
          <span ref={burgerRef} onClick={handleClick} role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbar-items" >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </span>
        </div>
        <div ref={menuRef} id="navbar-items" className="navbar-menu">
          <div className="navbar-start">
            <NavLink to="/polls" activeClassName="navlink-active" className="navbar-item is-size-4 is-size-5-mobile">Polls</NavLink>
            <NavLink to="/poll/create" activeClassName="navlink-active" className="navbar-item is-size-4 is-size-5-mobile">Create Poll</NavLink>
          </div>
          <UserControls />
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;