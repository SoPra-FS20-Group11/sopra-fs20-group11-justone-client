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
    
    const gameID = localStorage.getItem('gameID');
    
    //let location = useLocation();
    if (gameID) {
        return props.children;
    }
    else if(!localStorage.getItem("token")) {
        return <Redirect to={"/login"}/>;
    }
    return <Redirect to={"/lobby"}/>;
}
