import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { withRouter } from 'react-router-dom';
import Timer from '../../Timer.png';


const Container = styled(BaseContainer)`
  color: grey0;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const GameContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  align-self: center;
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

const ClueContainer = styled.div`
  margin-top: 20px;
  flex-direction: row;
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 35px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  width: 600px;
  height: 90px;
  border: none;
  border-radius: 5px;
  background: rgb(255, 229, 210);
`;


const MainButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  align-content: center;
  font-weight: 900;
  font-size: 30px;
  text-align: center;
  align-self: center;
  margin-left: 20px;
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
  width: 60%;
  height: 100px;
  font-family: system-ui;
  font-size: 20px;
  font-weight: 1000;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 10px;
  background: linear-gradient(rgb(255, 165, 0), rgb(255, 140, 0));
  transition: opacity 0.5s ease, transform 0.5s ease;
  outline: 10px solid black;
`;

const TimerForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 55%;
  height: 80px;
  font-family: system-ui;
  font-size: 20px;
  font-weight: 1000;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 10px;
  background: linear-gradient(rgb(255, 165, 0), rgb(255, 140, 0));
  transition: opacity 0.5s ease, transform 0.5s ease;
  outline: 10px dashed black;
  margin-top: 20px;
  margin-left: -300px;
  margin-bottom: 20px;
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
  align-content: center;
  font-weight: bold;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: grey0;
`;
const TimerContainer = styled.img`
margin-top: 0px;
margin-left: -30px;
position: absolute;
background: 'transparent';
height: 65px;
width: 65px;
opacity: 1;
`;

const Time = styled.h1`
  margin-top: 30px;
  font-weight: bold;
  font-family: system-ui;
  font-size: 30px;
  text-align: center;
`;

class Guess extends React.Component {
    myInterval;
    timeOut;

    constructor() {
        super();
        this.state = {
            gameID: localStorage.getItem('gameID'),
            allClues: null,
            clues: null,
            guess: null,
            seconds: 30,
            time: 0,
            overtimed: false,
            color: 'linear-gradient(rgb(150, 200, 0), rgb(150, 180, 0)',
            currentUserId: null,
            correctlyGuessed: null,
            duplicateClues: null,
            score: null,
            skipped: false,
            submitted: false
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
                if(response.data.status !== "FINISHED"){
                    await api.put(`/games/finish/${GameID}`);
                  }
              }


            const gameID = localStorage.getItem('gameID');
            const response = await api.get(`/clues/${gameID}`);
            const response2 = await api.get(`/games/${gameID}`);

            this.setState({currentUserId: response2.data.currentUserId});

            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.setState({allClues: response.data});

            const removeArrayItem = (arr, itemToRemove) => {
                return arr.filter(item => item !== itemToRemove)
              }

            this.state.allClues.clues = removeArrayItem(this.state.allClues.clues, 'OVERTIMED');

            const validClueArray = [];
            for(var i=0; i< this.state.allClues.length; i++){
                //if(this.state.allClues[i].valid == "VALID"){
                validClueArray.push(this.state.allClues[i]);
                //}
            }
            this.setState({clues: validClueArray});

            // This is the timer function
            this.myInterval = setInterval(() => { 
                    this.setState(({seconds}) => ({
                        seconds: seconds -1,
                        time: this.state.time + 1
                    })) 
                    if (this.state.seconds==15){
                        this.setState({color: 'linear-gradient(rgb(255, 20, 0), rgb(255, 0, 0)'})
                      }           
            }, 1000)

            this.timeOut = setTimeout(() => { this.props.history.push('/games/abort') }, 90000);
        } catch (error) {
            alert(`Something went wrong while fetching the clues: \n${handleError(error)}`);
        }

        if(this.state.clues){
            localStorage.setItem('clues', JSON.stringify(this.state.clues.clues));
        }else{
            localStorage.setItem('clues', null);
        }
    }

    async componentWillUnmount(){
        clearInterval(this.myInterval)
        clearTimeout(this.timeOut);
        localStorage.removeItem('currentPlayer');
    }

    async checkGuess(){
        const GameID = localStorage.getItem('gameID');

        const currentUserId = this.state.currentUserId;
        const responseGuess = await api.get('/guess/'+GameID);
        this.setState({guess: responseGuess.data});
        if (this.state.guess.guessStatus != "NOGUESS"){
            if (this.state.guess.guessStatus === "CORRECT"){
                const requestBody = JSON.stringify({
                    correctlyGuessed: 1,
                    duplicateClues: 0
                });
                await api.put(`/users/gamestats/${currentUserId}`, requestBody);              
                this.props.history.push('/games/resultwon');
            }else{
                this.props.history.push('/games/resultlost');
            }
        }
      }

    async submitGuess() {
        try {
            this.setState({submitted: true});
            await new Promise(resolve => setTimeout(resolve, 2000));
            const gameID = localStorage.getItem('gameID');
            //send a request to guess the mystery word
            const requestBody = JSON.stringify({
                guessWord: this.state.guess,
                time: this.state.time
            });
            const response = await api.post(`/guess/${gameID}`, requestBody);
            // ==> skip to the nextpage
            this.checkGuess();
        } catch (error) {
            alert(`Something went wrong during the submit of the guess: \n${handleError(error)}`);
        }
    }

    async skipGuess() {
        const gameID = localStorage.getItem('gameID');
        this.setState({skipped: true});
        // ==> put request: skip guess
        await api.put(`/skip/${gameID}`);
        // ==> skip to the nextpage
        await new Promise(resolve => setTimeout(resolve, 3500));
        this.props.history.push(`/games/resultlost`);
 
    }

    handleInputChange(key, value) {
        this.setState({[key]: value});
    }

    async timeOver(){
        clearInterval(this.myInterval);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await api.put(`/skip/${this.state.gameID}`);  
        this.props.history.push('/games/resultlost');     
    }
    // After the current player guessed, the next player will be set to the current Player

    render() {
        return (
            <Container>
                <Label2> Here you see the clues! Try to guess the mysteryword! </Label2>
                {!this.state.allClues ? (
                    <Spinner />
                ) : (
                    <GameContainer>
                        <Users>
                            {this.state.allClues.clues.map(clues => {
                                return (
                                    <ButtonContainer  key={clues.id}>
                                        <ClueContainer>
                                            {clues}
                                        </ClueContainer>
                                    </ButtonContainer>
                                    
                                );
                            })}
                        </Users>
                        {this.state.allClues.clues == null &&
                        <Label2 > No valid clue! </Label2>}
                        <Form>
                        <InputField 
                            disabled={this.state.seconds===0}
                            placeholder="Enter your guess..."
                            onChange={e => {
                                this.handleInputChange('guess', e.target.value);
                            }}
                        />
                        </Form>
                        &nbsp;
                        <TimerForm style={{background: this.state.color}}>
                        <TimerContainer src={Timer} />
                        {this.state.seconds === 0 
                        ? this.timeOver() && <Time>Time's Over!</Time>
                        : 
                        this.state.seconds != 0 && <Time >Time Remaining: {this.state.seconds < 10 ? `0${this.state.seconds}` : this.state.seconds}</Time>}               
                        </TimerForm>
                        <MainButton
                            disabled={!this.state.guess || this.state.seconds===0 || this.state.submitted}
                            width="10%"
                            onClick={() => {
                                this.submitGuess();
                            }}
                        > Submit
                        </MainButton>
                        &nbsp;
                        <MainButton
                            disabled={this.state.seconds===0 || this.state.skipped}
                            width="10%"
                            onClick={() => {
                                this.skipGuess();
                            }}
                            >
                            Skip guessing
                        </MainButton>
                    </GameContainer>
                )}
            </Container>
        )
    }
}
export default withRouter(Guess);