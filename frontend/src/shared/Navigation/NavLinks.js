import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../context/auth-context";
import "./NavLinks.css"

const NavLinks = props => {
    const auth = useContext(AuthContext);
    return (
    <ul className="nav-links">
        <li>
            <NavLink to="/parties/all" >
                ALL PARTIES
            </NavLink>
        </li>
        {auth.isLoggedIn && (
            <li>
                <NavLink to="/parties/new" >
                    CREATE PARTY
                </NavLink>
            </li>
        )}
        {auth.isLoggedIn && (
        <li>
            <NavLink to={`/party/${auth.userId}`}>
                MY INFO
            </NavLink>
        </li>
        )}
        {!auth.isLoggedIn && (
        <li>
            <NavLink to="/auth" >
                AUTH
            </NavLink>
        </li>
        )}
        {auth.isLoggedIn && (
        <li>
            <NavLink to="/auth">
                <button onClick={auth.logout}>LOGOUT</button>
            </NavLink>
        </li>
      )}
    </ul>)
}

export default NavLinks;