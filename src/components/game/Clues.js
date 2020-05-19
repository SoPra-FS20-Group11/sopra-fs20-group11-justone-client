import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import Game from '../shared/models/Game';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { MainButton } from '../../views/design/Buttons/MainScreenButtons';
import JustOneCards from '../../JustOneCards.png';
import { Spinner } from '../../views/design/Spinner';
import { css } from "@emotion/core";
const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  min-width: 1000px;
`;


const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  height: 450px;
  font-family: system-ui;
  font-size: 20px;
  font-weight: 1000;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 10px;
  background: linear-gradient(rgb(255, 165, 0), rgb(255, 140, 0));
  transition: opacity 0.5s ease, transform 0.5s ease;
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

const RulesButtonContainer = styled.div`
  display: flex;
  direction: rtl;
  margin-top: 4em;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-top: 1px;
`;

const Label2 = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  font-size: 30px;
  text-shadow: 0 0 10px black;
  color: rgba(240, 125, 7, 1);
  text-align: center;
`;

const Label3 = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  font-size: 50px;
  text-shadow: 0 0 10px black;
  color: rgba(240, 125, 7, 1);
  text-align: center;
`;

const Label4 = styled.h1`
  margin-top: 2em;
  font-family: system-ui;
  font-weight: 700;
  font-size: 25px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
`;
const override = css`
  background: rgb(0,0,0)}
`;
class Clues extends React.Component {
    intervalID;

    constructor() {
        super();
        this.state = {
          gameID: localStorage.getItem('gameID'),
          clue: null,
          clue2: null,
          allCluesBool: null,
          chosenWord: null,
          submitted: false,
          threePlayers: false,
          seconds: 30
        };
    }

    handleInputChange(key, value) {
        this.setState({[key]: value});
    }

    async componentDidMount() {
      const gameResponse = await api.get('/games/'+this.state.gameID)
      if (gameResponse.data.usersIds.length == 3){
        this.setState({threePlayers: true})
      }
      this.intervalID = setInterval(
          () => this.checkAllClues(),
          3000
      );
      const response = await api.get(`/chosenword/${this.state.gameID}`);
      this.setState({chosenWord: response.data.chosenWord})

      // This is the timer function
      this.myInterval = setInterval(() => {

        if (this.state.seconds > 0) {
          this.setState(({seconds}) => ({
            seconds: seconds -1
          }))
        }
        if (this.state.seconds === 0) {
          clearInterval(this.myInterval)
        }
      }, 1000)
    }

    componentWillUnmount() {
      clearInterval(this.intervalID, this.myInterval);
    }

    async checkAllClues(){
      const response = await api.get('/clues/'+this.state.gameID)
      this.setState({allCluesBool: response.data.allAutomaticClues});
      if (this.state.allCluesBool == true){
        this.props.history.push(`/games/checkphase`);
      }
    }

    async saveClue(){
      this.setState({submitted: true});
      const gameID = localStorage.getItem('gameID');
      const requestBody = JSON.stringify({
        clue: this.state.clue,
        time: 30
        });
      const response = await api.post(`/clues/${gameID}`, requestBody);

      if(this.state.clue2){
        const requestBody2 = JSON.stringify({
          clue: this.state.clue2,
          time: 30
          });
        await api.post(`/clues/${gameID}`, requestBody2)
      }
    }

    render() {
        return (
            <Container>
              <Form>
                {this.state.seconds === 0 
                ? <h1>Time's Over!</h1>
                : <h1> Time Remaining: {this.state.seconds < 10 ? `0${this.state.seconds}` : this.state.seconds}</h1>
                }
                </Form>
                <FormContainer>
                    <Label2> Give a clue to the following word! </Label2>
                    <Label3> "{this.state.chosenWord}" </Label3>
                    {this.state.threePlayers && <Label2> This is a 3-Player Game. You can give two clues! </Label2>}
                    <Form>
                        <InputField
                            placeholder="Enter your clue... "
                            onChange={e => {
                                this.handleInputChange('clue', e.target.value);
                            }}
                        />
                        {this.state.threePlayers &&
                        <InputField
                        placeholder="Enter your second clue... "
                        onChange={e => {
                            this.handleInputChange('clue2', e.target.value);
                        }}
                        />}
                        <ButtonContainer>
                            <MainButton
                                disabled={!this.state.clue ||  this.state.threePlayers && !this.state.clue2 || this.state.submitted}
                                width="10%"
                                onClick={() => {
                                    this.saveClue();                                                                      
                                }}
                                >
                                Submit
                                </MainButton>
                        </ButtonContainer>    
                        {!this.state.allCluesBool &&  this.state.submitted &&               
                          <Label4 > Wait for all players to submit a clue </Label4>}
                        {!this.state.allCluesBool && this.state.submitted &&
                          <Label4><Spinner ></Spinner></Label4>}
                    </Form>
                </FormContainer>
            </Container>
        );
    }
}
export default withRouter(Clues);