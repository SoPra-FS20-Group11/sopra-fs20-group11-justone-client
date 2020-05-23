import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import Profile from "../../users/Profile";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class ProfileRouter extends React.Component {

  render() {
    return (
      <Container>
        <Route
          exact
          path={`${this.props.base}/:Key`}
          render={() => <Profile />}
        />
        <Route
          exact
          path={`${this.props.base}`}
          render={() => <Redirect to={`${this.props.base}/Key`} />}
        />
      </Container>
    );
  }
}

export default ProfileRouter;
