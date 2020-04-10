import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import MyProfile from "../../users/MyProfile";


const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class MyProfileRouter extends React.Component {
    render() {
        return (
            <Container>
                <Route
                    exact
                    path={`${this.props.base}/:myID`}
                    render={() => <MyProfile />} 
                />
                <Route 
                    exact
                    path={`${this.props.base}`}
                    render={() => <Redirect to={`${this.props.base}/myID`} />}
                />
            </Container>
        );
    }
}
export default MyProfileRouter;