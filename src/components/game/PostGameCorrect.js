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
  align-items: auto;
`;

const GameContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
  height: 200px;
  margin-top: 40px;
  margin-bottom: 40px;
  font-family: system-ui;
  font-size: 40px;
  font-weight: 1000;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 10px;
  background: linear-gradient(rgb(255, 165, 0), rgb(255, 140, 0));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

export const CheckButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  width: 10%;
  color: rgba(0, 0, 0, 1);
  height: 30px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(230, 180, 100);
  transition: all 0.3s ease;
`

class PostGameCorrect extends React.Component {
    intervalID;
    
    constructor() {
        super();
        this.state = {
            points: null,
            game: null,
            gameRunning: null,
            currentUserId: null,
            updatedGame: null
        };
    }

    async componentDidMount() {
        try {
            const gameID = localStorage.getItem('gameID');
            const response = await api.get('/games/'+gameID);


            this.setState({ 
              game: response.data,
              currentUserId: response.data.currentUserId
             });
            

            
            //const response = await api.get(`/points/${gameID}`);

            //this.setState({ points: response.data });
            this.intervalID = setInterval(
              () => this.checkNextRound(),
              5000
          );
        } catch (error) {
            alert(`Something went wrong while fetching the points: \n${handleError(error)}`);
        }

    }

    componentWillUnmount() {
      clearInterval(this.intervalID);
    }

    async checkNextRound(){
      const GameID = localStorage.getItem('gameID');
      const localUser = localStorage.getItem('id');
      
      const response = await api.get('/games/'+GameID);
      this.setState({ updatedGame: response.data});
      this.setState({word: this.state.updatedGame.wordStatus});
      if (this.state.word == "NOCHOSENWORD"){
          if (localUser == this.state.game.currentUserId){
              this.props.history.push('/games/drawphase');
          }else{
              this.props.history.push('/games/waiting');
          }
      }
    }

    async next() {
      const gameID = localStorage.getItem('gameID');
      await api.put(`/games/finish/${gameID}`);
      await api.put(`/games/start/${gameID}`);
    } 


    render() {
      return (
        <Container>
        <GameContainer>
          <Form>Congratulations! X point(s) awarded</Form>
          {localStorage.getItem('id')==this.state.currentUserId &&
          <MainButton onClick={() => {this.next();
          }}> Next Round
          </MainButton>}
        </GameContainer>
        </Container>
      );
    }
}

export default withRouter(PostGameCorrect);