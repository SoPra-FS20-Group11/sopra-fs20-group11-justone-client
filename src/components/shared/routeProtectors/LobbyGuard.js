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
    responsefunction(window.location.pathname.split('/')[2]);
    const LocalPlayerID = localStorage.getItem('id');
    
    //let location = useLocation();
    if (localStorage.getItem('userIdGuard')) {
        const users = JSON.parse(localStorage.getItem('userIdGuard'));
        for (var j = 0; j < users.length; j++){
            if (users[j] == LocalPlayerID){
                localStorage.setItem('userX', JSON.stringify(users[j]));
                return props.children;
            }
        }
    }else if(!localStorage.getItem("token")) {
        return <Redirect to={"/login"}/>;
    }
    return <Redirect to={"/lobby"}/>;
}
