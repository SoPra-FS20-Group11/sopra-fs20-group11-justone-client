import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { MainButton } from '../../views/design/Buttons/MainScreenButtons';
import { LogoutButton } from '../../views/design/Buttons/MainScreenButtons';
import { RulesButton } from '../../views/design/Buttons/MainScreenButtons';
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import JustOneRule1 from "../../JustOneRule1.jpg";
import JustOneRule2 from "../../JustOneRule2.jpg";
import JustOneRule3 from "../../JustOneRule3.jpg";


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
  font-size: 50px;
  text-shadow: 0 0 10px black;
  color: rgba(240, 125, 7, 1);
  text-align: center;
`;

const JustOneRules = [JustOneRule1, JustOneRule2, JustOneRule3];

class MainScreen extends React.Component {
  constructor() {
    super();
    this.state = {
        users: null,
        photoIndex: 0,
        isOpen: false
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
    async startGame() {        
        this.props.history.push(`/lobby`);
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

  async componentDidMount() {
    
  }

  render() {
    const { photoIndex, isOpen } = this.state;
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
            <RulesButton type="button" onClick={() => this.setState({ isOpen: true })}>
              Rules
            </RulesButton>
            {isOpen && (
              <Lightbox
                mainSrc={JustOneRules[photoIndex]}
                nextSrc={JustOneRules[(photoIndex + 1) % JustOneRules.length]}
                prevSrc={JustOneRules[(photoIndex + JustOneRules.length - 1) % JustOneRules.length]}
                onCloseRequest={() => this.setState({isOpen:false})}
                onMovePrevRequest = {() => 
                  this.setState({
                    photoIndex: (photoIndex + JustOneRules.length - 1) % JustOneRules.length
                  })
                }
                onMoveNextRequest={() => 
                  this.setState({
                    photoIndex: (photoIndex + 1) % JustOneRules.length
                  })
                }
                />
            )}
            </RulesButtonContainer>
      </Container>     
    );
  }
}

export default withRouter(MainScreen);