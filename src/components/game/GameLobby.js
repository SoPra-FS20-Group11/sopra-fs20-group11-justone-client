import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Games from '../../views/Games';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import { Redirect, Route } from "react-router-dom";
import DrawCard from './DrawCard';
import Game from '../shared/models/Game';

const Container = styled(BaseContainer)`
  color: grey0;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const GameContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Label2 = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  font-size: 30px;
  text-shadow: 0 0 10px black;
  color: rgba(204, 73, 3, 1);
  text-align: center;
`;

const GameButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 25px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  width: 600px;
  height: 90px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 210);
  transition: all 0.3s ease;
`;

const MainButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 30px;
  text-align: center;
  margin-left: auto;
  color: rgba(0, 0, 0, 1);
  width: 50%;
  height: 50px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 153);
  transition: all 0.3s ease;
`;

class GameLobby extends React.Component {
  constructor() {
    super();
    this.state = {
      games: null,
      currentUserId: null
    };
  }

  /*
  logout() {
    localStorage.removeItem('token');
    this.props.history.push('/login');
  }
  */

  async componentDidMount() {
    try {
      const response = await api.get('/games');
      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the returned users and update the state.
      this.setState({ games: response.data });

      // This is just some data for you to see what is available.
      // Feel free to remove it.
      console.log('request to:', response.request.responseURL);
      console.log('status code:', response.status);
      console.log('status text:', response.statusText);
      console.log('requested data:', response.data);

      // See here to get more data.
      console.log(response);
    } catch (error) {
      alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }
  return() {
    this.props.history.push('/main');
  }

  async joinGame(gameId) {
    try {
      localStorage.setItem('gameID', gameId);
      const currentId = localStorage.getItem('id');
      const requestBody = JSON.stringify({
        currentUserId: currentId
      });
      const response = await api.put('/games/'+gameId, requestBody);
      this.props.history.push(`/game/${response.data.id}`);
    } catch (error) {
      alert(`Something went wrong while fetching the game: \n${handleError(error)}`)
    }
  }

  async createNewGame() {
    try {
      const currentId = localStorage.getItem('id');
      const requestBody = JSON.stringify({
        currentUserId: currentId
      });
      const response = await api.post('/games', requestBody);

      const game = new Game(response.data);
      const gameId = game.id;
      localStorage.setItem('gameID', gameId);
      this.props.history.push(`/game/${game.id}`)
    } catch (error) {
      alert(`Something went wrong during the creation of a new Game: \n${handleError(error)}`);
    }
  }

  render() {
    return (
      <Container>
        <Label2> Choose your Game! </Label2>
        {!this.state.games ? (
          <Spinner />
        ) : (
          <GameContainer>
            <Users>
              {this.state.games.map(game => {
                return (
                  <ButtonContainer key={game.id}>
                    <GameButton
                      width="100%"
                      onClick={() => {
                        this.joinGame(game.id);
                      }}
                    >
                      <Games game={game} />
                    </GameButton>
                  </ButtonContainer>
                );
              })}
            </Users>
            <MainButton
              width="100%"
              onClick={() => {
                this.return();
              }}
            >
              Return
            </MainButton>
            &nbsp;
            <MainButton
              width="100%"
              onClick={() => {
                this.createNewGame();
              }}
            >
              Create new Game
            </MainButton>
          </GameContainer>
        )}
      </Container>
    );
  }
}

export default withRouter(GameLobby);
