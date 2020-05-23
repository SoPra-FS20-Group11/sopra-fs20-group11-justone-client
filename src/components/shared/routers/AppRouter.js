import React from "react";
import { BrowserRouter, Redirect, Route, Switch, useLocation } from "react-router-dom";
import { AppGuard } from "../routeProtectors/AppGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../login/Login";
import MainScreen from "../../mainscreen/MainScreen";
import { RegistrationGuard } from "../routeProtectors/RegistrationGuard";
import Registration from "../../register/Registration";
import MyProfileRouter from "./MyProfileRouter";
import ProfileRouter from "./ProfileRouter";
import Scoreboard from "../../scoreboard/Scoreboard"

import SearchRouter from "./SearchRouter";
import GameLobby from "../../game/GameLobby";

import LobbyRouter from "./LobbyRouter";
import { GameGuard } from "../routeProtectors/GameGuard";
import { LobbyGuard } from "../routeProtectors/LobbyGuard";
import EndScreen from "../../game/EndScreen";


class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <div>
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
              path="/main"
              render={() => (
                <AppGuard>
                  <MainScreen />
                </AppGuard>
              )}
            />
            <Route
              path={`/lobby`}
              render={() => (
                <AppGuard>
                  <GameLobby />
                </AppGuard>
              )}
            />
            <Route
              path="/game"
              render={() => (
                <LobbyGuard>
                  <LobbyRouter base={"/game"} />
                </LobbyGuard>
              )}
            />
            <Route
              path="/games"
              render={() => (
                <GameGuard>
                  <GameRouter base={"/games"}/>
                </GameGuard>
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
              path="/search"
              render={() => (
                <AppGuard>
                  <SearchRouter base={"/search"}/>
                </AppGuard>
              )}
            />
            <Route 
              path="/profile"
              render={() => (
                <AppGuard>
                  <ProfileRouter base={"/profile"}/>
                </AppGuard>
              )}
            /> 
            <Route 
              path="/myprofile"
              render={() => (
                <AppGuard>
                  <MyProfileRouter base={"/myprofile"}/>
                </AppGuard>
              )}
            /> 
            <Route
              exact
              path={`${this.props.base}/end4428`}
              render={() => (
            <EndScreen />
            )}
            />
            <Route path="/" exact render={() => <Redirect to={"/login"} />} />
          </div>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
