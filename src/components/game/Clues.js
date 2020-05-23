import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { MainButton } from '../../views/design/Buttons/MainScreenButtons';
import { Spinner } from '../../views/design/Spinner';
import Timer from '../../Timer.png';

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

  font-family: system-ui;
  font-weight: 700;
  font-size: 25px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
`;

const TimerContainer = styled.img`
margin-top: 18px;
margin-left: -20px;
position: relative;
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
const TimerForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: 'center';
  position: relative;
  margin-top: 50px;
  width: 270px;
  height: 100px;
  font-family: system-ui;
  font-size: 12px;
  font-weight: 1000;
  margin-left: 13em;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 10px;
  background: linear-gradient(rgb(150, 200, 0), rgb(150, 180, 0));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;
const SpinnerCont = styled.div`
  margin-top: 0em;
  color: rgba(0, 0, 0, 1);
`;

class Clues extends React.Component {
    intervalID;
    timeOut;
    downloadTimer;
    isSafed = false;

    constructor() {
        super();
        this.state = {
          gameID: localStorage.getItem('gameID'),
          clue: null,
          clue2: null,
          allCluesBool: null,
          chosenWord: null,
          submitted: false,
          threePlayers: 0,
          seconds: 20,
          time: 0,
          color: 'linear-gradient(rgb(150, 200, 0), rgb(150, 180, 0)',
          duplicateClues: null,
          currentUserId: null,
          timeOver: true,
          timeRunOut: false
        };
    }

    handleInputChange(key, value) {
        this.setState({[key]: value});
    }

    async componentDidMount() {
      window.onbeforeunload = async function() {
        const currentId = localStorage.getItem('id');
        localStorage.clear();
        const requestBody = JSON.stringify({
        id : currentId
        });
        await api.put('/logout', requestBody);
      }


      const gameID = localStorage.getItem('gameID')
      const gameResponse = await api.get('/games/'+gameID)

      if(gameResponse.data.normalMode == false){
        this.setState({threePlayers: 1})
      }
      const response = await api.get(`/chosenword/${this.state.gameID}`);
      this.setState({chosenWord: response.data.chosenWord})

      const response2 = await api.get(`/games/${this.state.gameID}`);
      this.setState({currentUserId: response2.data.currentUserId});

      var timeleft = 20;
      this.downloadTimer = setInterval(() => {
        this.setState(({seconds}) => ({
          seconds: seconds -1,
          time: this.state.time + 1
        }))
        if (timeleft==10){
            this.setState({color: 'linear-gradient(rgb(255, 20, 0), rgb(255, 0, 0)'})
          }
        if(timeleft <= 0){
          clearInterval(this.downloadTimer);
          this.setState({timeRunOut: true})
        }
        timeleft -= 1;
      }, 1000);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.intervalID = setInterval(
          () => this.checkAllClues(),
          1500
      );

      this.timeOut = setTimeout(() => { this.props.history.push('/games/abort') }, 90000);
    }

    timeOver(){
      this.setState({
        timeOver: false,
        clue: "OVERTIMED",
        time: -1});
      if(this.state.threePlayers==1){
        this.setState({clue2: "OVERTIMED"});
      }
      if(this.isSafed==false){
        this.saveClue();
      }
    }

    componentWillUnmount() {
      clearInterval(this.intervalID);
      clearInterval(this.downloadTimer);
      clearTimeout(this.timeOut);
    }

    async checkAllClues(){
      if (this.state.timeRunOut == true && this.state.timeOver == true){
        this.timeOver();}
      const response = await api.get('/clues/'+this.state.gameID)
      this.setState({allCluesBool: response.data.allAutomaticClues});
      if (this.state.allCluesBool == true){
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.props.history.push(`/games/checkphase`);
      }
    }

    async saveClue(){ 
      this.setState({submitted: true});
      const gameID = localStorage.getItem('gameID');
      const requestBody = JSON.stringify({
        clueWord: this.state.clue,
        time: this.state.time
        });
      const response = await api.post(`/clues/${gameID}`, requestBody);
      if (response.data.valid == "DUPLICATE") {
        const requestBodyDC = JSON.stringify({
          duplicateClues: 1
        });
        await api.put(`/users/gamestats/${this.state.currentUserId}`, requestBodyDC);
      }

      if(this.state.clue2){
        await new Promise(resolve => setTimeout(resolve, 1000));
        const requestBody2 = JSON.stringify({
          clueWord: this.state.clue2,
          time: this.state.time
          });
        const response2 = await api.post(`/clues/${gameID}`, requestBody2)
        if (response2.data.valid == "DUPLICATE") {
          const requestBodyDC2 = JSON.stringify({
            duplicateClues: 1
          });
          await api.put(`/users/gamestats/${this.state.currentUserId}`, requestBodyDC2);
        }
      }
      this.isSafed = true;  
    }

    render() {
        return (
            <Container>
                <FormContainer>
                    <Label2> Give a clue to the following word! </Label2>
                    <Label3> "{this.state.chosenWord}" </Label3>
                    {this.state.threePlayers==1 && <Label2> This is a 3-Player Game. You can give two clues! </Label2>}
                    <Form>
                        <InputField
                            placeholder="Enter your clue... "
                            onChange={e => {
                                this.handleInputChange('clue', e.target.value);
                            }}
                        />
                        {this.state.threePlayers==1 &&
                        <InputField
                        placeholder="Enter your second clue... "
                        onChange={e => {
                            this.handleInputChange('clue2', e.target.value);
                        }}
                        />}
                        <ButtonContainer>
                            <MainButton
                                disabled={!this.state.clue ||  (this.state.threePlayers==1 && !this.state.clue2) || this.state.submitted }
                                width="10%"
                                onClick={() => {
                                    this.saveClue();                                                                      
                                }}
                                >
                                Submit
                                </MainButton>
                        </ButtonContainer>
                    
                        {this.state.submitted &&               
                          <Label4 > Wait for all players to submit a clue </Label4>}
                        {this.state.submitted &&
                          <SpinnerCont><Spinner ></Spinner></SpinnerCont>}
                        {!this.state.submitted && 
                        <TimerForm style={{background: this.state.color}}> 
                        <TimerContainer src={Timer} />
                        {this.state.seconds === 0 
                        ? ( <Time>Time's Over!</Time>)
                        : (<h1>Time Remaining: </h1>)}
                        {this.state.seconds != 0 && <Time >{this.state.seconds < 10 ? `0${this.state.seconds}` : this.state.seconds}</Time>}               
                        </TimerForm>  }
                    </Form>
                </FormContainer>
            </Container>
        );
    }
}
export default withRouter(Clues);