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
import { Spinner } from '../../views/design/Spinner';
import InGamePlayer from '../../views/InGamePlayer';
import ScoreboardPlayer from '../../views/ScoreboardPlayer';

//Pop-Up Screen for Scoreboard
import Modal from 'react-modal';

//for the Spinner
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;
const LabelContainer = styled.div`
  margin-top: -2em;
`;

const Label2 = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  font-size: 50px;
  text-shadow: 0 0 10px black;
  color: rgba(240, 125, 7, 1);
  text-align: center;
`;
const Users = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 0;
  justify-content: center;
`;
const InGamePlayerField = styled.div`
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 20px;
  text-align: left;
  color: rgba(0, 0, 0, 1);
  width: 250px;

  border: none;
  border-radius: 5px;
  background: rgb(255, 229, 210);
`;
const PlayerContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: 'center';
  justify-content: center;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 0em;
`;

const ScoreboardPlayerButton = styled.button`
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
  width: 900px;
  height: 90px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 210);
  transition: all 0.3s ease;
  margin-top: 20px;
`;

const CloseButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 30px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  width: 20%;
  height: 50px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 153);
  transition: all 0.3s ease;
  margin-top: 20px;
`;

const ScoreboardButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 30px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  width: 200px;
  height: 50px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 153);
  transition: all 0.3s ease;
  margin-top: -100px;
  margin-left: 900px;
`;

Modal.setAppElement('#root');

class WaitingForGuess extends React.Component {
  intervalID;
  
  constructor() {
    super();
    this.state = {
        allUsers: null,
        game: null,
        activePlayerName: null,
        wordChosen: null,
        guess: null,
        userIds: [],
        modalIsOpen: false,
        setModalIsOpen: false
    };
  }

  sortByScore(a, b) {
    const user1 = a.score;
    const user2 = b.score;

    let comparison = 0;
    if (user1 < user2) {
      comparison = 1;
    } else if (user1 > user2) {
      comparison = -1;
    }
    return comparison;
  } 

  async componentDidMount() {
    const GameID = localStorage.getItem('gameID');
    const responseUsers = await api.get('/users');
    this.setState({ allUsers : responseUsers.data});
    this.state.allUsers.sort(this.sortByScore);

    const response = await api.get('/games/'+GameID);
    this.setState({game: response.data});

    var userIdArray = [];
    for (var j = 0; j < this.state.game.usersIds.length; j++){
        for (var i = 0; i < this.state.allUsers.length; i++) {
            if (this.state.game.usersIds[j] == this.state.allUsers[i].id){
             userIdArray.push(this.state.allUsers[i]);
            }
        }
    }
    this.setState({userIds: userIdArray});

    const UserList = [];
    for (var i = 0; i < this.state.allUsers.length; i++) {
        if (this.state.game.currentUserId == this.state.allUsers[i].id){
            UserList.push(this.state.allUsers[i].username);
        }
    }
    this.setState({activePlayerName: UserList});

    this.intervalID = setInterval(
        () => this.checkGuess(),
        3000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  async checkGuess(){
    const GameID = localStorage.getItem('gameID');
    const responseGuess = await api.get('/guess/'+GameID);
    this.setState({guess: responseGuess.data});
    if (this.state.guess.guessStatus != "NOGUESS"){
        if (this.state.guess.guessStatus === "CORRECT"){
            this.props.history.push('/games/resultwon');
        }else{
            this.props.history.push('/games/resultlost');
        }
    }
  }

  setModalIsOpen(boolean) {
    this.setState({modalIsOpen: boolean})
  }

  render() {
    return (
      <Container>
        <LabelContainer>
        &nbsp;
        <Label2> Waiting for "{this.state.activePlayerName}" to submit a guess.. </Label2>
        <Loader
            type="Triangle"
            color="rgba(240, 125, 7, 1)"
            height={200}
            width={200}
        />
        <ScoreboardButton onClick={() => this.setModalIsOpen(true)}>Scoreboard</ScoreboardButton>
        </LabelContainer>
        {!this.state.userIds ? (
                 <Spinner />
                    ) : (
                    <Users>
                    {this.state.userIds.map(user => {
                        return (
                            <PlayerContainer key={user.id}>
                                <InGamePlayerField>
                                    <InGamePlayer user={user} />
                                    {user.username == this.state.activePlayerName && 
                                    <div>Currently submitting a guess...</div>}
                                    {user.username != this.state.activePlayerName && 
                                    <div>Waiting...</div>}
                                </InGamePlayerField>
                            </PlayerContainer>
                        );
                    })}
                    </Users>
                )}
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={() => this.setModalIsOpen(false)}
                    style={
                            {
                              overlay: {
                                  top: 100,
                                  left: 100,
                                  right: 100,
                                  bottom: 50,
                                  backgroundColor: 'rgba(255, 255, 255, 0.75)',
                                  border: '1px solid #ccc',
                                  borderRadius: '40px'
                              },
                              content: {
                              color: '#3b0303',
                              background: '#8f1010',
                              borderRadius: '40px'
                              }
                            }
                      }
                      >
                      <Users>
                      {this.state.userIds.map(user => {
                        return (
                          <ButtonContainer key={user.id}>
                              <ScoreboardPlayerButton>
                                <ScoreboardPlayer user={user} />
                              </ScoreboardPlayerButton>
                          </ButtonContainer>
                          );
                        })}
                      </Users>
                      <ButtonContainer>
                        <CloseButton onClick={() => this.setModalIsOpen(false)}>Close</CloseButton>
                      </ButtonContainer>   
                  </Modal>  
      </Container>     
    );
  }
}

export default withRouter(WaitingForGuess);