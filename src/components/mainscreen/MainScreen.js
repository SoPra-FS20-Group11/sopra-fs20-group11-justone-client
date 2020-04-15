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
  font-size: 30px;
  text-shadow: 0 0 10px black;
  color: rgba(204, 73, 3, 1);
  text-align: center;
`;


class MainScreen extends React.Component {
  constructor() {
    super();
    this.state = {
        users: null
    };
  }

  async logout() {
    
    const currentId = localStorage.getItem('id');
    localStorage.clear();

    const requestBody = JSON.stringify({
      id : currentId
    });
    this.props.history.push('/login');
    await api.put('/logout', requestBody);

    
  }

    //navigate to the route /preparation
    startGame() {
        this.props.history.push(`/game`);
    }

    scoreboard() {
        this.props.history.push(`/scoreboard`);
    }

    myprofile(){
        this.props.history.push(`/myprofile`);
    }

    rules(){
        this.props.history.push(`/rules`);
    }


  render() {
    return (
      <Container>
        &nbsp;
        <Label2> Welcome {localStorage.getItem('username')} </Label2>
        <ButtonContainer>
            <MainButton
              width="100%"
              onClick={() => {
                  this.startGame();
              }}
            >
            Start Game
            </MainButton>
            </ButtonContainer>
            <ButtonContainer>
            <MainButton
              width="100%"
              onClick={() => {
                this.scoreboard();
              }}
            >
              Scoreboard
            </MainButton>
            </ButtonContainer>
            <ButtonContainer>
            <MainButton
              width="100%"
              onClick={() => {
                this.myprofile();
              }}
            >
              My Profile
            </MainButton>
            </ButtonContainer>
            <ButtonContainer>
            <LogoutButton
              width="100%"
              onClick={() => {
                this.logout();
              }}
            >
              Logout
            </LogoutButton>
            </ButtonContainer>
            <RulesButtonContainer>
            <RulesButton
              width="100%"
              onClick={() => {
                this.rules();
              }}
            >
              Rules
            </RulesButton>
            </RulesButtonContainer>
      </Container>     
    );
  }
}

export default withRouter(MainScreen);