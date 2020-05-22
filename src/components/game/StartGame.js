import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import ScoreboardPlayer from '../../views/ScoreboardPlayer';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';


const Container = styled(BaseContainer)`
  color: grey0;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Label2 = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  font-size: 30px;
  text-shadow: 0 0 10px black;
  color: rgba(240, 125, 7, 1);
  text-align: center;
`;

const PlayerForm = styled.button`
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 25px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  width: 600px;
  height: 90px;
  border: none;
  border-radius: 5px;
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 210);
  transition: all 0.3s ease;
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
  margin-right: 20px;
`;

const MainButton = styled.button`
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
  width: 70%;
  height: 50px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 153);
  transition: all 0.3s ease;
  margin-top: 10px;
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
  margin-top: 10px;
`;

const InputField = styled.input`
  &::placeholder {
    color: grey4;
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: grey0;
  border-radius: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: grey0;
`;
const SearchFieldContainer = styled.li`
  display: flex;
  position: fixed; 
  margin-left: 50px;
  right: 10%;
  flex-direction: row;
  justify-content: center;
`;

const SearchButton = styled.button`
height: 35px;
font-weight: bold;
padding-left: 15px;
margin-left: 4px;
border: grey0;
border-radius: 20px;
font-weight: bold;
margin-bottom: 20px;
background: rgba(255, 255, 255, 0.2);
color: grey0;
justify-content: center;
`;

Modal.setAppElement('#root');

class StartGame extends React.Component {
    intervalID;

    constructor() {
        super();
        this.state = {
            game: null,
            users: null,
            userIds: [],
            allUsers: null,
            allUserList: null,
            currentPlayer: null,
            currentIndex: 0,
            lobbyUser: null,
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
        try {
            const GameID = localStorage.getItem('gameID');
            
            const responseUsers = await api.get('/users');
            this.setState({ allUsers : responseUsers.data});
            this.state.allUsers.sort(this.sortByScore)

            const response = await api.get('/games/'+GameID);
            this.setState({users: response.data.usersIds});
            this.setState({game: response.data});
            this.setState({lobbyUser: response.data.currentUserId});
            
            var userIdArray = [];
            for (var j = 0; j < this.state.game.usersIds.length; j++){
                for (var i = 0; i < this.state.allUsers.length; i++) {
                if (this.state.game.usersIds[j] == this.state.allUsers[i].id){
                    userIdArray.push(this.state.allUsers[i]);
                    }
                }
            }
            this.setState({userIds: userIdArray});
            this.setState({currentPlayer: this.state.userIds});
            
            await new Promise(resolve => setTimeout(resolve, 3000))
            this.intervalID = setInterval(
                () => this.directPlayers(),
                1500
            );

        } catch (error) {
            alert(`Something went wrong while fetching the user: \n${handleError(error)}`);
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
      }

    async return () {
        const currentId = localStorage.getItem('id');
        const requestBody = JSON.stringify({
        currentUserId: currentId
        });
        const gameId = localStorage.getItem('gameID');
        await api.put('/games/leave/'+gameId, requestBody);
        /*if(this.state.lobbyUser == currentId){
          await api.put(`/games/finish/${gameId}`);
        }*/
        this.props.history.push('/lobby');
    }

    async startGame() {
        localStorage.setItem('userIds', this.state.userIds);
        if (this.state.userIds.length < 3) {
            alert(`Not enough Players! Must be atleast 3 Players to start the game!`);
        } else {
            const gameId = localStorage.getItem('gameID');
            const id = localStorage.getItem('id');
            const requestBody = JSON.stringify({
                currentUserId: id
            });
            await api.put('/games/start/'+gameId, requestBody);
        }
    }

    async directPlayers(){
        const GameID = localStorage.getItem('gameID');
        const responseGame = await api.get('/games/'+GameID);
        const responseUsers = await api.get('/users');
        this.setState({ allUserList : responseUsers.data});
        var userIdArray = [];
        for (var j = 0; j < responseGame.data.usersIds.length; j++){
            for (var i = 0; i < this.state.allUserList.length; i++) {
                if (responseGame.data.usersIds[j] == this.state.allUserList[i].id){
                    userIdArray.push(this.state.allUserList[i]);
                }
            }
        }
        this.setState({userIds: userIdArray});
        this.forceUpdate();
        const status = responseGame.data.status;
        const currentId = this.state.game.currentUserId;
        const currentPlayer = localStorage.getItem('id')
        if (status == "RUNNING") {
            if (currentId == currentPlayer) {
              this.props.history.push(`/games/drawphase`);
            } else {
              this.props.history.push(`/games/waiting`);
            }
          }
          if (status == "FINISHED") {
            this.props.history.push(`/lobby`);
          }
    }
    

    async showUsers() {
        
        this.props.history.push('/game/players');
    }

    setModalIsOpen(boolean) {
        this.setState({modalIsOpen: boolean})
    }

    render () {
        return (
            <Container>
                <Label2> Game: {localStorage.getItem('gameID')} </Label2>
                {!this.state.userIds ? (
                    <Spinner />
                ) : (
                    <div>
                        <Users>
                            {this.state.userIds.map(user => {
                                return (
                                    <ButtonContainer key={user.id}>
                                        <PlayerForm>
                                            <Player user={user} />
                                        </PlayerForm>
                                    </ButtonContainer>
                                );
                            })}
                        </Users>
                        {this.state.lobbyUser==localStorage.getItem('id') &&
                        <MainButton
                            width="100%"
                            onClick={() => {
                                this.startGame();
                            }}>
                        Play!
                        </MainButton>}
                        <MainButton
                            width="100%"
                            onClick={() => {
                                this.return();
                            }}>
                        Return
                        </MainButton>
                        <MainButton onClick={() => this.setModalIsOpen(true)}>Scoreboard</MainButton>
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
                            {this.state.userIds.map((user,index) => {
                                return (
                                    <ButtonContainer key={user.id}>
                                        <RankingButton> {index + 1} </RankingButton>
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
                    </div>
                )}
            </Container>
        );
    }
}
export default withRouter(StartGame);