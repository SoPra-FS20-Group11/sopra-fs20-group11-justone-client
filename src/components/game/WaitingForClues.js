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
import ScoreboardPlayer from '../../views/ScoreboardPlayer';

//Pop-Up Screen for Scoreboard
import Modal from 'react-modal';
import Modal2 from 'react-modal';

import InGamePlayer from '../../views/InGamePlayer';
//for the Spinner
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;
const LabelContainer = styled.div`
  margin-top: 4em;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 250px;
  height: 90px;
  font-family: system-ui;
  font-size: 20px;
  font-weight: 1000;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 10px;
  background: linear-gradient(rgb(255, 165, 0), rgb(255, 140, 0));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const Label = styled.label`
  color: grey0;
  margin-bottom: 10px;
  text-transform: none;
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
  margin-top: 0em;
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

class WaitingForClues extends React.Component {
    intervalID;

    constructor() {
        super();
        this.state = {
            allUsers: null,
            userIds: [],
            game: null,
            activePlayerName: null,
            allClues: null,
            NoClues: false,
            modalIsOpen: false,
            modalIsOpen2: false,
            clickedUser: null,
            wordDecided: null,
            changeableWord: null
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
        this.setState({allUsers : responseUsers.data});
        this.state.allUsers.sort(this.sortByScore)

        const response = await api.get(`/games/${GameID}`);

        this.setState({
            game: response.data,
            wordDecided: response.data.wordStatus,
            changeableWord: response.data.changeWord});

        //list of all players in the particular lobby
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
        for (var i=0; i < this.state.allUsers.length; i++) {
            if (this.state.game.currentUserId == this.state.allUsers[i].id) {
                UserList.push(this.state.allUsers[i].username);
            }
        }
        this.setState({activePlayerName: UserList});

        this.intervalID = setInterval(
            () => this.checkClues(),
            3000
        );
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    async checkClues() {
        const GameID = localStorage.getItem('gameID');
        const responseClues = await api.get(`/clues/${GameID}`);
        const responseWord = await api.get(`/chosenword/${GameID}`);
        localStorage.setItem('word', this.state.wordDecided);
        this.setState({
            allClues: responseClues.data.allManualClues,
            wordDecided: responseWord.data.wordStatus});

        if (this.state.wordDecided=="REJECTED"){
            this.redirectToDraw();
        }
        if (this.state.allClues == true) {
            if (responseClues.data.clues.length<=0){
                this.setState({NoClues: true});
                this.redirectToLost();           
            }else{
                this.props.history.push('/games/guessphase');
            }
        }
    }

    async redirectToLost(){
        await new Promise(resolve => setTimeout(resolve, 6000))
        await api.put(`/skip/${this.state.game.id}`);
        this.props.history.push('/games/resultlost');
    }

    setModalIsOpen(boolean) {
        this.setState({modalIsOpen: boolean})
    }
    setModalIsOpen2(boolean) {
        this.setState({modalIsOpen2: boolean})
    }

    async setId(userId) {
        const response = await api.get(`/users/${userId}`);
        this.setState({clickedUser: response.data});
        localStorage.setItem('clickedUsername', this.state.clickedUser.username);
        localStorage.setItem('clickedName', this.state.clickedUser.name);
        localStorage.setItem('clickedScore', this.state.clickedUser.score)
        localStorage.setItem('clickedGamesPlayed', this.state.clickedUser.gamesPlayed);
    }

    async redirectToDraw(){    
        await new Promise(resolve => setTimeout(resolve, 6000))
        this.props.history.push('/games/drawphase');
    }
    
    render() {
        return (
            <Container>
                <LabelContainer>
                &nbsp;
                {this.state.wordDecided=="SELECTED" && this.state.changeableWord &&
                <Label2> Waiting for the other players to accept or reject the word... </Label2> 
                }
                {this.state.wordDecided=="REJECTED" &&
                <Label2> The word was rejected! Choose a new word. Redirecting... </Label2>}
                {this.state.wordDecided=="ACCEPTED" &&
                <Label2> The word was accepted! </Label2> &&
                <Label2> Waiting for the clues! </Label2>}
                {!this.state.NoClues && 
                <Loader
                    type="Triangle"
                    color="rgba(240, 125, 7, 1)"
                    height={200}
                    width={200}
                />}
                {this.state.NoClues && <Label2> No valid clue received! Ending the turn... </Label2>}
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
                                    <div>Waiting...</div>}
                                    {user.username != this.state.activePlayerName && 
                                    <div>Currently submitting clues...</div>}
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
                                <ScoreboardPlayerButton onClick={() => {this.setModalIsOpen2(true); this.setId(user.id)}}>
                                    <ScoreboardPlayer user={user} />
                                </ScoreboardPlayerButton>
                                <Modal2 
                                    isOpen={this.state.modalIsOpen2}
                                    onRequestClose={() => this.setModalIsOpen2(false)}
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
                                    <ButtonContainer>
                                        <Label2>User Profile of "{localStorage.getItem('clickedUsername')}"</Label2>
                                        <Form>
                                            <Label> Name: </Label>
                                            {localStorage.getItem('clickedName')}
                                        </Form>
                                        &nbsp;
                                        <Form>
                                            <Label> Username: </Label>
                                            {localStorage.getItem('clickedUsername')}
                                        </Form>
                                        &nbsp;
                                        <Form>
                                            <Label> Score: </Label>
                                            {localStorage.getItem('clickedScore')}
                                        </Form>
                                        &nbsp;
                                        <Form>
                                            <Label> Games played: </Label>
                                            {localStorage.getItem('clickedGamesPlayed')}
                                        </Form>
                                    </ButtonContainer>
                                </Users> 
                                <ButtonContainer>
                                    <CloseButton onClick={() => this.setModalIsOpen2(false)}>Back</CloseButton>
                                </ButtonContainer>
                                </Modal2>
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

export default withRouter(WaitingForClues);