import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { AppGuard } from "../routeProtectors/AppGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../login/Login";
import MainScreen from "../../mainscreen/MainScreen";
import { RegistrationGuard } from "../routeProtectors/RegistrationGuard";
import Registration from "../../register/Registration";
import { MyProfileGuard } from "../routeProtectors/MyProfileGuard";
import MyProfileRouter from "./MyProfileRouter";
import Scoreboard from "../../scoreboard/Scoreboard"


/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <div>
            <Route
              path="/main"
              render={() => (
                <AppGuard>
                  <MainScreen />
                </AppGuard>
              )}
            />
            <Route
              path="/game"
              render={() => (
                <AppGuard>
                  <GameRouter base={"/game"} />
                </AppGuard>
              )}
            />
            <Route
              path="/login"
              exact
              render={() => (
                <LoginGuard>
                  <Login />
                </LoginGuard>
              )}
            />
            <Route 
              path="/registration"
              exact
              render={() => (
                <RegistrationGuard>
                  <Registration />
                </RegistrationGuard>
              )}
            />
            <Route 
              path="/scoreboard"
              exact
              render={() => (
                <AppGuard>
                  <Scoreboard/>
                </AppGuard>
              )}
            />
            <Route 
              path="/myprofile"
              render={() => (
                <MyProfileGuard>
                  <MyProfileRouter base={"/myprofile"} />
                </MyProfileGuard>
              )}
            /> 
            <Route path="/" exact render={() => <Redirect to={"/main"} />} />
          </div>
        </Switch>
      </BrowserRouter>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default AppRouter;
