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


class MainScreen extends React.Component {
  constructor() {
    super();
    this.state = {
        users: null
    };
  }

    logout() {
      //update the localStorage by removing toke and adding user id
      const id = localStorage.getItem('ID'); 
      localStorage.removeItem('token');    
      //navigate to the route /login 
      this.props.history.push('/login');
      //HTTP PUT request is sent to the backend to update the online status.
      api.put('/logout', id)
    }

    //navigate to the route /preparation
    startGame() {
        this.props.history.push(`/preparation`);
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