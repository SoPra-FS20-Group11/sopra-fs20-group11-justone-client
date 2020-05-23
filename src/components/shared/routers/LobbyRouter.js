import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import StartGame from "../../game/StartGame";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class LobbyRouter extends React.Component {
  render() {
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
          render={() => <Redirect to={`/lobby`} />}
        />
       
      </Container>
    );
  }
}
export default LobbyRouter;