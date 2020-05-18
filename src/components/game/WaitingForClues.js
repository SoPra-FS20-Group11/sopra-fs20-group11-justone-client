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

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
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
  color: rgba(204, 73, 3, 1);
  text-align: center;
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
        this.setState({allUsers : responseUsers.data});
        this.state.allUsers.sort(this.sortByScore)

        const response = await api.get(`/games/${GameID}`);
        this.setState({game: response.data});

        const UserList = [];
        for (var i=0; i < this.state.allUsers.length; i++) {
            if (this.state.game.currentUserId == this.state.allUsers[i].id) {
                UserList.push(this.state.allUsers[i].username);
            }
        }
        this.setState({activePlayerName: UserList});

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
        this.setState({allClues: responseClues.data.allManualClues});
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
    
    render() {
        return (
            <Container>
                <LabelContainer>
                &nbsp;
                <Label2> Waiting for the Clues! </Label2>
                {!this.state.NoClues && 
                <Loader
                    type="Triangle"
                    color="rgba(204, 73, 3, 1)"
                    height={200}
                    width={200}
                />}
                {this.state.NoClues && <Label2> No valid clue received! Ending the turn... </Label2>}
                </LabelContainer>
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

export default withRouter(WaitingForClues);