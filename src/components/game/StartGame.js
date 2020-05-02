import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';

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
  color: rgba(204, 73, 3, 1);
  text-align: center;
`;

const PlayerButton = styled.button`
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
  width: 600px;
  height: 90px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 210);
  transition: all 0.3s ease;
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

class StartGame extends React.Component {
    intervalID;

    constructor() {
        super();
        this.state = {
            game: null,
            users: null,
            userIds: [],
            allUsers: null,
            currentPlayer: null,
            currentIndex: 0
        };
    }
    async componentDidMount() {
        try {
            const GameID = localStorage.getItem('gameID');
            const requestBody = JSON.stringify({
                id: GameID
            });
            const responseUsers = await api.get('/users');
            this.setState({ allUsers : responseUsers.data});

            const {gameId} = this.props.match.params;
            const response = await api.get('/games/'+GameID);
            this.setState({users: response.data.usersIds});
            this.setState({game: response.data});
            this.setState({lobbyUser: response.data.currentUserId});
            const uniqueSet = new Set(this.state.users);
            const uniqueUsers = [...uniqueSet];

            for (var j = 0; j < uniqueUsers.length; j++){
                for (var i = 0; i < this.state.allUsers.length; i++) {
                    if (uniqueUsers[j] == this.state.allUsers[i].id){
                        this.state.userIds.push(this.state.allUsers[i]);
                    }
                }
            }
            this.setState({currentPlayer: this.state.userIds[this.state.currentIndex]});
            localStorage.setItem('currentPlayer', this.state.currentPlayer.id);
            localStorage.setItem('currentPlayerIndex', this.state.currentIndex);
            localStorage.setItem('PlayersList', JSON.stringify(uniqueUsers));
            // this.nextPlayer();
            
            this.intervalID = setTimeout(
                () => this.directPlayers(),
                7000
            );

        } catch (error) {
            alert(`Something went wrong while fetching the user: \n${handleError(error)}`);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.intervalID);
      }

    async return () {
        const currentId = localStorage.getItem('id');
        const requestBody = JSON.stringify({
        currentUserId: currentId
        });
        const gameId = localStorage.getItem('gameID');
        await api.put('/games/leave/'+gameId, requestBody);
        this.props.history.push('/games/lobby');
    }

    async startGame() {

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
        const status = this.state.game.status;
        const currentId = this.state.game.currentUserId;
        const currentPlayer = localStorage.getItem('id')
        if (status == "RUNNING") {
            if (currentId == currentPlayer) {
              this.props.history.push(`/games/drawphase`);
            } else {
              this.props.history.push(`/games/waiting`);
            }
          }
    }
    

    async showUsers() {
        
        this.props.history.push('/game/players');
    }

    nextPlayer() {
        this.setState({currentIndex: (this.state.currentIndex + 1) % this.state.userIds.length});
        this.setState({currentPlayer: this.state.userIds[this.state.currentIndex]});
        localStorage.setItem('currentPlayer', JSON.stringify(this.state.currentPlayer.id));
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
                                        <PlayerButton>
                                            <Player user={user} />
                                        </PlayerButton>
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
                    </div>
                )}
            </Container>
        );
    }
}
export default withRouter(StartGame);