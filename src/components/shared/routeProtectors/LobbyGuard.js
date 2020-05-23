import React from "react";
import { Redirect } from "react-router-dom";
import { api } from "../../../helpers/api";

async function responsefunction(gameId) {
    localStorage.setItem('location', gameId);
    const response = await api.get(`/games/${gameId}`)
    const users = JSON.stringify(response.data.usersIds);
    localStorage.setItem('userIdGuard', users);
}

export const LobbyGuard = props => {
    localStorage.setItem('location', (window.location.pathname.split('/')[2]));
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
