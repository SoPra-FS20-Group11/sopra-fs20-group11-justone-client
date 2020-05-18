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
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;
const LabelContainer = styled.div`
  margin-top: 4em;
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


class WaitingForDraw extends React.Component {
  intervalID;
  
  constructor() {
    super();
    this.state = {
        allUsers: null,
        game: null,
        activePlayerName: null,
        wordChosen: null,
        wordStatus: null,
        changeableWord: null
    };
  }



  async componentDidMount() {
    const GameID = localStorage.getItem('gameID');
    const responseUsers = await api.get('/users');
    this.setState({ allUsers : responseUsers.data});

    const response = await api.get('/games/'+GameID);
    this.setState({
      game: response.data,
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
    for (var i = 0; i < this.state.allUsers.length; i++) {
        if (this.state.game.currentUserId == this.state.allUsers[i].id){
            UserList.push(this.state.allUsers[i].username);
        }
    }
    this.setState({activePlayerName: UserList});

    this.intervalID = setInterval(
        () => this.checkChosenWord(),
        3000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  async checkChosenWord(){
    const GameID = localStorage.getItem('gameID');
    const responseWord = await api.get('/chosenword/'+GameID);
    this.setState({wordChosen: responseWord.data.chosenWord});
    this.setState({wordStatus: responseWord.data.wordStatus});
    if (this.state.wordStatus == "SELECTED"){
      if(this.state.changeableWord){
        this.props.history.push('/games/checkwordphase');
      }else{
        this.props.history.push('/games/clues');
      }
    }
  }

  render() {
    return (
      <Container>
        <LabelContainer>
        &nbsp;
        <Label2> Waiting for Player "{this.state.activePlayerName}" to draw a card and/or choose a word.. </Label2>
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
                  <div>Currently Drawing...</div>}
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

export default withRouter(WaitingForDraw);