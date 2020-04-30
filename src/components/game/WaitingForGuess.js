import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { MainButton } from '../../views/design/Buttons/MainScreenButtons';
import { LogoutButton } from '../../views/design/Buttons/MainScreenButtons';
import { RulesButton } from '../../views/design/Buttons/MainScreenButtons';

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;
const LabelContainer = styled.div`
  margin-top: 4em;
`;

const RulesButtonContainer = styled.div`
  display: flex;
  direction: rtl;
  margin-top: 4em;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 3em;
`;

const Label2 = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  font-size: 50px;
  text-shadow: 0 0 10px black;
  color: rgba(204, 73, 3, 1);
  text-align: center;
`;


class WaitingForDraw extends React.Component {
  constructor() {
    super();
    this.state = {
        allUsers: null,
        game: null,
        activePlayerName: null,
        wordChosen: null
    };
  }



  async componentDidMount() {
    const GameID = localStorage.getItem('gameID');
    const responseUsers = await api.get('/users');
    this.setState({ allUsers : responseUsers.data});

    const response = await api.get('/games/'+GameID);
    this.setState({game: response.data});
    const UserList = [];
    for (var i = 0; i < this.state.allUsers.length; i++) {
        if (this.state.game.currentUserId == this.state.allUsers[i].id){
            UserList.push(this.state.allUsers[i].username);
        }
    }
    this.setState({activePlayerName: UserList});

    this.intervalID = setInterval(
        () => this.checkGuess(),
        5000
    );
  }

  async checkGuess(){
    const GameID = localStorage.getItem('gameID');
    const responseGuess = await api.get('/guess/'+GameID);
    this.setState({guess: responseGuess.data});
    if (this.state.guess.guess != null){
        if (this.state.guess.guessStatus === "CORRECT"){
            this.props.history.push('/games/resultwon');
        }else{
            this.props.history.push('/games/resultlost');
        }
    }
  }

  render() {
    return (
      <Container>
        <LabelContainer>
        &nbsp;
        <Label2> Waiting for {this.state.activePlayerName} to submit a guess.. </Label2>
        </LabelContainer>
      </Container>     
    );
  }
}

export default withRouter(WaitingForDraw);