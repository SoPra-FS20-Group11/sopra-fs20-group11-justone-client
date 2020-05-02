import React from "react";
import styled from "styled-components";
import { Redirect, Route, Switch } from "react-router-dom";
import GameLobby from "../../game/GameLobby";
import DrawCard from "../../game/DrawCard";
import Clues from "../../game/Clues";
import CheckClues from "../../game/CheckClues";
import CheckWord from "../../game/CheckWord";
import StartGame from "../../game/StartGame";
import Guess from "../../game/Guess";
import {CurrentPlayerGuard} from "../routeProtectors/CurrentPlayerGuard";
import Overview from "../../game/Overview";
import WaitingForDraw from "../../game/WaitingForDraw";
import WaitingForGuess from "../../game/WaitingForGuess";
import WaitingForClues from "../../game/WaitingForClues";
import PostGameCorrect from "../../game/PostGameCorrect";
import PostGameWrong from "../../game/PostGameWrong";


const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class GameRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
      <Container>
        <Switch>
        <Route
          path={`${this.props.base}/lobby`}
          render={() => <GameLobby />}
        />
        <Route
          path={`${this.props.base}/drawphase`}
          render={() => (
            //<CurrentPlayerGuard>
              <DrawCard />
            //</CurrentPlayerGuard>
          )}
        />
        <Route
          exact
          path={`${this.props.base}`}
          render={() => <Redirect to={`${this.props.base}/drawphase`} />}
        />
        <Route 
          path={`${this.props.base}/guessphase`}
          render={() => (
            //<CurrentPlayerGuard>
              <Guess />
            //</CurrentPlayerGuard>
          )}
        />
        <Route
          exact
          path={`${this.props.base}/checkwordphase`}
          render={() => <CheckWord />}
        />
        <Route
          path={`${this.props.base}/checkphase`}
          render={() => <CheckClues />}
        />
        <Route
          exact
          path={`${this.props.base}/clues`}
          render={() => <Clues />}
        />
        <Route
          exact
          path={`${this.props.base}/waiting`}
          render={() => <WaitingForDraw />}
        />
        <Route 
          exact
          path={`${this.props.base}/waiting1`}
          render={() => <WaitingForClues />}
        />
        <Route
          exact
          path={`${this.props.base}/waiting2`}
          render={() => <WaitingForGuess />}
        />
        <Route
          exact
          path={`${this.props.base}/overview`}
          render={() => (
              <Overview />
          )}
        />
        <Route
          exact
          path={`${this.props.base}/resultwon`}
          render={() => (
            <PostGameCorrect />
          )}
        />
        <Route
          exact
          path={`${this.props.base}/resultlost`}
          render={() => (
            <PostGameWrong />
          )}
        />
        <Route
            exact
            path={`${this.props.base}`}
            render={() => <Redirect to={`${this.props.base}/clues`} />}
        /> 
        </Switch>   
      </Container>
    );
  }
}

export default GameRouter;
