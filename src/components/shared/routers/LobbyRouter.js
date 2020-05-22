import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import GameLobby from "../../game/GameLobby";
import DrawCard from "../../game/DrawCard";
import Clues from "../../game/Clues";
import StartGame from "../../game/StartGame";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class LobbyRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
      <Container>
        <Route
          exact
          path={`${this.props.base}/:gameID`}
          render={() => <StartGame />}
        />
        <Route
          exact
          path={`${this.props.base}`}
          render={() => <Redirect to={`${this.props.base}/gameID`} />}
        />
       
      </Container>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default LobbyRouter;