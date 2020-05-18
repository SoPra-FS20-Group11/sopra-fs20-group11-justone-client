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
//for the Spinner
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;
const LabelContainer = styled.div`
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
class WaitingForClues extends React.Component {
    intervalID;

    constructor() {
        super();
        this.state = {
            allUsers: null,
            game: null,
            activePlayerName: null,
            allClues: null,
            NoClues: false,
            userIds: null,
            wordDecided: null,
            changeableWord: null
        };
    }

    async componentDidMount() {
        const GameID = localStorage.getItem('gameID');
        const responseUsers = await api.get('/users');
        this.setState({allUsers : responseUsers.data});

        const response = await api.get(`/games/${GameID}`);
        this.setState({
            game: response.data,
            wordDecided: response.data.wordStatus,
            changeableWord: response.data.changeWord});

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
            </Container>
        );
    }
}

export default withRouter(WaitingForClues);