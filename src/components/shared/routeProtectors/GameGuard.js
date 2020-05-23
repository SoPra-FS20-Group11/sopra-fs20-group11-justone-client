import React from "react";
import { Redirect } from "react-router-dom";
import { api } from "../../../helpers/api";

  
export const GameGuard = props => {
    const LocalPlayerID = localStorage.getItem('id');
    const gameID = localStorage.getItem('gameID');
    const currentPlayer = localStorage.getItem('currentPlayer');

    //let location = useLocation();
    if (gameID) {
        return props.children;
    }else if(!localStorage.getItem("token")) {
        return <Redirect to={"/login"}/>;
    }
    return <Redirect to={"/main"}/>;
}