import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import Search from "../../scoreboard/Search";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class SearchRouter extends React.Component {
    render() {
        /**
         * "this.props.base" is "/profile" because as been passed as a prop in the parent of ProfileRouter
         */
        return (
            <Container>
                <Route
                    exact
                    path={`${this.props.base}/:foundUser`}
                    render={() => <Search />}
                />
            <Route
            exact
            path={`${this.props.base}`}
            render={() => <Redirect to={`${this.props.base}/:foundUser`} />}
            />
            </Container>
        );
    }
}
/*
* Don't forget to export your component!
 */
export default SearchRouter;