import React from "react";
import { Redirect } from "react-router-dom";

export const CurrentPlayerGuard = props => {
    const currentPlayerID = localStorage.getItem('id');
    const gameID = localStorage.getItem('gameID');
    const currentPlayer = localStorage.getItem('currentPlayer');

    //let location = useLocation();
    var currentLocation = window.history.back();
    localStorage.setItem('siite', currentLocation);
    if (currentPlayerID == currentPlayer) {
        return props.children;
    }
    return <Redirect to={currentLocation} />;
}
