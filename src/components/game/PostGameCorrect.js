import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { withRouter } from 'react-router-dom';
import InGamePlayer from '../../views/InGamePlayer';

const Container = styled(BaseContainer)`
  color: grey0;
  text-align: center;
  align-items: auto;
`;
const GameContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
  width: 50%;
  height: 50px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 153);
  transition: all 0.3s ease;
`;
const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
  height: 200px;
  margin-top: 40px;
  margin-bottom: 40px;
  font-family: system-ui;
  font-size: 40px;
  font-weight: 1000;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 10px;
  background: linear-gradient(rgb(255, 165, 0), rgb(255, 140, 0));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;
export const CheckButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  width: 10%;
  color: rgba(0, 0, 0, 1);
  height: 30px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(230, 180, 100);
  transition: all 0.3s ease;
`
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

class PostGameCorrect extends React.Component {
    intervalID;
    timeOut;
    constructor() {
        super();
        this.state = {
            points: null,
            game: null,
            chosenWord: null,
            gameRunning: null,
            currentUserId: null,
            updatedGame: null,
            word: null,
            endgame: false,
            userIds: null,
            cardScore: 0,
            clickedNext: false
        };
    }

    async componentDidMount() {
        try {
          window.onbeforeunload = async function() {
            const GameID = localStorage.getItem('gameID');
            const response = await api.get('/games/'+GameID);
            const currentId = localStorage.getItem('id');
            localStorage.clear();
            const requestBody = JSON.stringify({
            id : currentId
            });
            await api.put('/logout', requestBody);
            const requestBodyScore = JSON.stringify({
                score: response.data.score
            });
            await api.put(`/users/score/${currentId}`, requestBodyScore);
            if(response.data.status !== "FINISHED"){
                await api.put(`/games/finish/${GameID}`);
              }
          }


            const gameID = localStorage.getItem('gameID');
            const response = await api.get('/games/'+gameID);
            const responseUsers = await api.get('/users');
            const responseCard = await api.get('/cards/'+gameID);

            this.setState({ 
              allUsers : responseUsers.data,
              game: response.data,
              chosenWord: response.data.chosenWord,
              currentUserId: response.data.currentUserId,
              cardScore: responseCard.data.score
             });

            var userIdArray = [];
            for (var j = 0; j < this.state.game.usersIds.length; j++){
                for (var i = 0; i < this.state.allUsers.length; i++) {
                    if (this.state.game.usersIds[j] == this.state.allUsers[i].id){
                    userIdArray.push(this.state.allUsers[i]);
                    }
                }
            }
            this.setState({userIds: userIdArray});
 
            //const response = await api.get(`/points/${gameID}`);

            await new Promise(resolve => setTimeout(resolve, 2000))
            this.intervalID = setInterval(
              () => this.checkNextRound(),
              1500
          );
          
          if (this.state.game.deckSize==0){
            this.setState({ending: true});
            this.endgame();
          }
        } catch (error) {
            alert(`Something went wrong while fetching the points: \n${handleError(error)}`);
        }
        this.timeOut = setTimeout(() => { this.props.history.push('/games/abort') }, 90000);
    }

    async endgame(){  
        await new Promise(resolve => setTimeout(resolve, 6000))
        this.props.history.push('/games/end');
    }

    componentWillUnmount() {
      clearInterval(this.intervalID);
      clearTimeout(this.timeOut);
    }

    async checkNextRound(){
      const GameID = localStorage.getItem('gameID');
      const localUser = localStorage.getItem('id');
      
      const response = await api.get('/games/'+GameID);
      this.setState({ updatedGame: response.data});
      const wordStatus = this.state.updatedGame.wordStatus;
      this.setState({word: wordStatus});
      if (this.state.word == "NOCHOSENWORD"){
          if (localUser == this.state.updatedGame.currentUserId){
              this.props.history.push('/games/drawphase');
          }else{
              this.props.history.push('/games/waiting');
          }
      }
    }

    async next() {
      this.setState({clickedNext: true});
      await new Promise(resolve => setTimeout(resolve, 2500));
      const gameID = localStorage.getItem('gameID');
      await api.put(`/games/reset/${gameID}`);
    } 


    render() {
      return (
        <Container>
        <GameContainer>
          <Form>Congratulations! The word {this.state.chosenWord} was guessed correctly! <div>{this.state.cardScore} point(s) awarded</div></Form>
          {this.state.ending &&
          <Label2>This was the last round! Calculating points... </Label2>}
          {localStorage.getItem('id')==this.state.currentUserId && !this.state.ending &&
          <MainButton 
            disabled={this.state.clickedNext}
            onClick={() => {this.next();
          }}> Next Round
          </MainButton>}
          {!this.state.userIds ? (
                 <Spinner />
                    ) : (
                    <Users>
                    {this.state.userIds.map(user => {
                        return (
                            <PlayerContainer key={user.id}>
                                <InGamePlayerField>
                                    <InGamePlayer user={user} />
                                </InGamePlayerField>
                            </PlayerContainer>
                        );
                    })}
                    </Users>
                )} 
        </GameContainer>
        </Container>
      );
    }
}

export default withRouter(PostGameCorrect);