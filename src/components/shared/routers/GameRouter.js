import React from "react";
import styled from "styled-components";
import { Redirect, Route, Switch } from "react-router-dom";
import GameLobby from "../../game/GameLobby";
import DrawCard from "../../game/DrawCard";
import Clues from "../../game/Clues";
import StartGame from "../../game/StartGame";

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
          exact
          path={`${this.props.base}/lobby`}
          render={() => <GameLobby />}
        />
        <Route
            exact
            path={`${this.props.base}`}
            render={() => <Redirect to={`${this.props.base}/lobby`} />}
        />
        <Route
          path={`${this.props.base}/drawphase`}
          render={() => <DrawCard />}
        />
        <Route
            exact
            path={`${this.props.base}`}
            render={() => <Redirect to={`${this.props.base}/drawphase`} />}
        />
        <Route
          exact
          path={`${this.props.base}/clues`}
          render={() => <Clues />}
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
