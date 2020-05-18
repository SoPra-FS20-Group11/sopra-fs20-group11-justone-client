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
        userIds: null
    };
  }



  async componentDidMount() {
    const GameID = localStorage.getItem('gameID');
    const responseUsers = await api.get('/users');
    this.setState({ allUsers : responseUsers.data});

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

  render() {
    return (
      <Container>
        <LabelContainer>
        &nbsp;
        <Label2> Waiting for Player "{this.state.activePlayerName}" to submit a guess.. </Label2>
        <Loader
            type="Triangle"
            color="rgba(240, 125, 7, 1)"
            height={200}
            width={200}
        />
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
      </Container>     
    );
  }
}

export default withRouter(WaitingForGuess);