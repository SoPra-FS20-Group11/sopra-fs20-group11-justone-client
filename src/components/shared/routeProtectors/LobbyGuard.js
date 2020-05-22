import React from "react";
import { Redirect } from "react-router-dom";
import { api } from "../../../helpers/api";

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * {props.children} are rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */

async function responsefunction(gameId) {
    const gameID = localStorage.getItem('gameID');
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
