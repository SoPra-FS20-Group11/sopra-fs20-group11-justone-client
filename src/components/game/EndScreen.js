import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { withRouter } from 'react-router-dom';


const Container = styled(BaseContainer)`
  color: grey0;
  text-align: center;
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

class EndScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            gameId: null,
            totalPoints: null,
            game: null,
        };
    }

    async componentDidMount() {
        try {
            localStorage.setItem('currentPage', 'end');
            const gameID = localStorage.getItem('gameID');
            const localUserId = localStorage.getItem('id');

            this.setState({ gameId: gameID });
            //const response = await api.get(`/totalPoints/${gameID}`);

            const responseGame = await api.get('/games/'+gameID);
            this.setState({
              game: responseGame.data,
              totalPoints: responseGame.data.score
            });
            const responseScore = await api.get(`/games/${gameID}`);
            this.setState({score: responseScore.data.score})
            const requestBodyScore = JSON.stringify({
                score: this.state.score
            });
            await api.put(`/users/score/${localUserId}`, requestBodyScore);

            if(this.state.game.currentUserId==localUserId && this.state.game.status != "FINISHED"){
              await api.put(`/games/finish/${gameID}`);
            }
        } catch (error) {
            alert(`Something went wrong while fetching the total points: \n${handleError(error)}`);
        }

    }

    finish() {
      this.props.history.push(`/main`);
      localStorage.removeItem('gameID');
    } 


    render() {
      return (
        <Container>
          <GameContainer>
            {this.state.totalPoints == null ? (
            <Spinner />
            ) : (
            <Form>Game is over! You reached a total of {this.state.totalPoints} Points</Form>
            )}
            <MainButton onClick={() => {this.finish();
            }}> Return
            </MainButton>
          </GameContainer>
        </Container>
      );
    }
}

export default withRouter(EndScreen);