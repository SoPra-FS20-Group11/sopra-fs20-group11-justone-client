import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
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
  margin-top: 3em;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ButtonContainer2 = styled.div`
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

const RankingButton = styled.button`
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
  width: 80px;
  height: 90px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 110);
  transition: all 0.3s ease;
  margin-top: 20px;
  margin-right: 20px;
`;

const ScoreboardButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  position: absolute;
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 40px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  width: 250px;
  height: 80px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 153);
  transition: all 0.3s ease;
  margin-top: -1.6em;
  margin-left: 300px;
`;

Modal.setAppElement('#root');

class WaitingForClues extends React.Component {
    _isMounted = false;
    isRedirected = false;
    intervalID;
    timeOut;
    constructor() {
        super();
        this.state = {
            isLoading: true,
            allUsers: [],
            userIds: [],
            game: null,
            activePlayerName: null,
            allClues: null,
            NoClues: false,
            modalIsOpen: false,
            modalIsOpen2: false,
            clickedUser: null,
            wordDecided: null,
            changeableWord: null,

            clickedUsername: null,
            clickedName: null,
            clickedScore: null,
            clickedGamesPlayed: null,
            clickedCorrectlyGuessed: null
        };
    }

    async componentDidMount() {
        window.onbeforeunload = async function() {
            const GameID = localStorage.getItem('gameID');
            const response = await api.get('/games/'+GameID);
            const currentId = localStorage.getItem('id');
            localStorage.clear();
            const requestBody = JSON.stringify({
            id : currentId
            });
            await api.put('/logout', requestBody);
            if(response.data.status !== "FINISHED"){
                await api.put(`/games/finish/${GameID}`);
              }
          }


        this._isMounted = true;
        const GameID = localStorage.getItem('gameID');
        await api.get('/users').then(responseUsers => {
            if (this._isMounted) {
                this.setState({allUsers : responseUsers.data});
            }
        })
        this.setState({allUsers: this.state.allUsers.sort((a, b) => (a.score < b.score) ? 1 : -1)});

        await api.get(`/games/${GameID}`).then(response => {
            if (this._isMounted) {
                this.setState({
                    game: response.data,
                    wordDecided: response.data.wordStatus,
                    changeableWord: response.data.changeWord})
                }
            })

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

        await new Promise(resolve => setTimeout(resolve, 2000))
        this.intervalID = setInterval(
            () => this.checkClues(),
            1500
        );
        this.timeOut = setTimeout(() => { this.props.history.push('/games/abort') }, 90000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
        this._isMounted = false;
        clearTimeout(this.timeOut);
    }

    async checkClues() {
        const GameID = localStorage.getItem('gameID');
        const responseClues = await api.get(`/clues/${GameID}`);
        const responseWord = await api.get(`/chosenword/${GameID}`);

        const removeArrayItem = (arr, itemToRemove) => {
            return arr.filter(item => item !== itemToRemove)
          }
        const clueArray = removeArrayItem(responseClues.data.clues, 'OVERTIMED');

        this.setState({
            allClues: responseClues.data.allManualClues,
            wordDecided: responseWord.data.wordStatus});

        if (this.state.wordDecided=="REJECTEDBYALL"){
            this.redirectToDraw();
        }
        if (this.state.allClues == true && this.isRedirected == false) {
            if (clueArray.length<=0){
                this.setState({NoClues: true});
                this.redirectToLost();           
            }else{
                this.props.history.push('/games/guessphase');
            }
        }
    }

    async redirectToLost(){
        this.isRedirected = true;
        await api.put(`/skip/${this.state.game.id}`);
        await new Promise(resolve => setTimeout(resolve, 7500))
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

        const player = new User(response.data);

        this.setState({clickedUsername: player.username})
        this.setState({clickedName: player.name})
        this.setState({clickedScore: player.score})
        this.setState({clickedCorrectlyGuessed: player.correctlyGuessed})
        this.setState({clickedGamesPlayed: player.gamesPlayed})
    }

    async redirectToDraw(){    
        await new Promise(resolve => setTimeout(resolve, 5000))
        this.props.history.push('/games/drawphase');
    }

    isPlayerInGame(id){
        var color = 'rgba(0, 0, 0, 1)';
        for (var j = 0; j < this.state.userIds.length; j++){
          if(id == this.state.game.usersIds[j]){
            color = '#03AC13';
          }
        }
        return color;
    }

    render() {
        return (
            <Container>
                <ScoreboardButton onClick={() => this.setModalIsOpen(true)}>Scoreboard</ScoreboardButton>
                <LabelContainer>
                &nbsp;
                {((this.state.wordDecided=="SELECTED" && this.state.changeableWord) || this.state.wordDecided=="REJECTED") &&
                <Label2> Waiting for the other players to accept or reject the word... </Label2> 
                }
                {this.state.wordDecided=="REJECTEDBYALL" &&
                <Label2> The word was rejected! Choose a new word. Redirecting... </Label2>}
                {this.state.wordDecided=="ACCEPTED" &&
                <Label2> The word was accepted! </Label2>}
                {this.state.wordDecided=="ACCEPTED" &&
                <Label2> Waiting for the clues! </Label2>}
                 {this.state.wordDecided=="SELECTED" && !this.state.changeableWord &&
                 <Label2> Waiting for the clues! </Label2>}
                {!this.state.NoClues && 
                <Loader
                    type="Triangle"
                    color="rgba(240, 125, 7, 1)"
                    height={200}
                    width={200}
                />}
                {this.state.NoClues && <Label2> No valid clue received! Ending the turn... </Label2>}
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
                                    {(user.username != this.state.activePlayerName && (this.state.wordDecided == "ACCEPTED" || (this.state.wordDecided == "REJECTED" && !this.state.changeableWord ) || !this.state.changeableWord)) &&
                                    <div>Currently submitting clues...</div>}
                                    {user.username != this.state.activePlayerName &&  this.state.wordDecided !== "ACCEPTED" && this.state.wordDecided !== "REJECTEDBYALL"  && !(this.state.wordDecided == "SELECTED" && !this.state.changeableWord) &&
                                    <div>Checking the word...</div>}
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
                    {this.state.allUsers.map((user,index) => {
                        return (
                                
                            <ButtonContainer key={user.id}>
                                <RankingButton> {index+1} </RankingButton>
                                <ScoreboardPlayerButton style={{color: this.isPlayerInGame(user.id)}} onClick={() => {this.setModalIsOpen2(true); this.setId(user.id)}}>
                                    <ScoreboardPlayer  user={user} />
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
                                    <ButtonContainer2>
                                        <Label2>User Profile of "{this.state.clickedUsername}"</Label2>
                                        <Form>
                                            <Label> Name: </Label>
                                            {this.state.clickedName}
                                        </Form>
                                        &nbsp;
                                        <Form>
                                            <Label> Username: </Label>
                                            {this.state.clickedUsername}
                                        </Form>
                                        &nbsp;
                                        <Form>
                                            <Label> Score: </Label>
                                            {this.state.clickedScore}
                                        </Form>
                                        &nbsp;
                                        <Form>
                                            <Label> Games Played: </Label>
                                            {this.state.clickedGamesPlayed}
                                        </Form>
                                        &nbsp;
                                        <Form>
                                            <Label> Correctly Guessed Words: </Label>
                                            {this.state.clickedCorrectlyGuessed}
                                        </Form>
                                    </ButtonContainer2>
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