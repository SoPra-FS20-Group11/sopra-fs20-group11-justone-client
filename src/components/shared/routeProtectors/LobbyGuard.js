import React from "react";
import { Redirect } from "react-router-dom";


export const LobbyGuard = props => {
    const gameID = localStorage.getItem('gameID');
    
    //let location = useLocation();
    if (gameID) {
        if (gameID == localStorage.getItem('location')){
            return props.children;
        }
    }
    else if(!localStorage.getItem("token")) {
        return <Redirect to={"/login"}/>;
    }
    return <Redirect to={"/lobby"}/>;
}
