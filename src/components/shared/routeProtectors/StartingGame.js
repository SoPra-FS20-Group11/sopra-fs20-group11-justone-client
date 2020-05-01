import React from "react";
import { Redirect } from "react-router-dom";
import { api, handleError } from '../../../helpers/api';


// if the the game is running, every player will go to the game
export const StartingGame = async() => {
    const gameID = localStorage.getItem('gameID');
    const response = await api.get(`/games/${gameID}`);
    const Game = await response.json();
    const status = Game.status;
    return Boolean(status == "RUNNING");
}