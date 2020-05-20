import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { MainButton } from '../../views/design/Buttons/MainScreenButtons';
import JustOneCards from '../../JustOneCards.png';
import JustOneSingle from '../../JustOneSingle.png';


const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
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
  margin-top: 1px;
`;

const ButtonContainer2 = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: -45px;
  position: absolute;
`;

const Label2 = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  font-size: 30px;
  text-shadow: 0 0 10px black;
  color: rgba(240, 125, 7, 1);
  text-align: center;
`;

const RoundLabel = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  text-decoration: underline;
  font-size: 40px;
  margin-top: 30px;
  text-shadow: 0 0 10px black;
  color: rgba(240, 125, 7, 1);
  text-align: center;
`;

const ImgContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  justify-content: center;
`;

const JustOneDeck = styled.img`
  position: relative;
  justify-content: center;
`;
const JustOneNext = styled.img`
  margin-bottom: 300px;
  position: absolute;
  margin-left: 10em;
`;

export const WordButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  margin-top: 8px;
  width: 170px;
  padding: 5px;
  box-shadow: 1px 1px 1px 1px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 28px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  border: none;
  border-radius: 10px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 238, 205);
  transition: all 0.3s ease;
`;

class DrawCard extends React.Component {
    constructor() {
        super();
        this.state = {
            users: null,
            drawnCardBool: false,
            card: null,
            round: null,
            chosenWordStatus: null,
            gameID: localStorage.getItem('gameID')
        };
    }
    async componentDidMount() {
      const response = await api.get(`/games/${this.state.gameID}`);
      const responseChosenWord = await api.get(`/chosenword/${this.state.gameID}`);
      this.setState({
        round: response.data.round,
        chosenWordStatus: responseChosenWord.data.wordStatus
      });
    }

    async drawNewCard() {
      this.setState({drawnCardBool: true});
      this.forceUpdate();

      const gameID = localStorage.getItem('gameID');
      const response = await api.put(`/cards/${gameID}`);
      this.setState({card: response.data.words});

      var cardarray = new Array();
      for (var i = 0; i < response.data.words.length; i++) {
        cardarray.push(response.data.words[i])}
      localStorage.setItem('card', JSON.stringify(cardarray));
    }

    async setChosenWord(wordNum){
      const number = wordNum-1;
      const gameID = localStorage.getItem('gameID');
      var requestBody = null;
      const card = JSON.parse(localStorage.getItem('card'));
      var requestBody = JSON.stringify({
        chosenWord: this.state.card[number]
      })
      await api.put('/chosenword/'+gameID, requestBody)
      localStorage.setItem('wordnum', wordNum);
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.props.history.push(`/games/waiting1`); 
    }

    render() {
      const drawnCardBool = this.state.drawnCardBool;
      const chosenWordStatus = this.state.chosenWordStatus;
      let renderRight;   
      const numbers = [1, 2, 3, 4, 5];
      if (!drawnCardBool && chosenWordStatus == "NOCHOSENWORD"){
        renderRight =
            <Container>
              <RoundLabel> Round {this.state.round} </RoundLabel>
                <JustOneDeck src={JustOneCards} alt= "Just One Cards" height={400} />
                  <Label2> Draw a card from the stack! </Label2>
                  <ButtonContainer>
                    <MainButton
                        width="100%"
                        onClick={() => {
                            this.drawNewCard();
                        }}
                    >
                    Draw a card
                    </MainButton>
                </ButtonContainer>
            </Container>
      }else{
        renderRight = 
            <Container>
              <RoundLabel> Round {this.state.round} </RoundLabel>
                <ImgContainer>
                <JustOneDeck src={JustOneSingle} alt= "Just One Cards" height={380} />
                <ButtonContainer2>
                    {numbers.map((number) => {
                      return (               
                        <ButtonContainer key={number}> 
                        <WordButton 
                            disabled={number==localStorage.getItem('wordnum') && chosenWordStatus != "NOCHOSENWORD"}                    
                            width="100%"
                            onClick={() => {
                                this.setChosenWord(number);                  
                            }}
                          >                        
                          <div> Word {number}</div>             
                    </WordButton>
                    </ButtonContainer>);})}
                </ButtonContainer2>  
                <JustOneNext src={JustOneCards} alt= "Just One Cards" height={420} />       
                </ImgContainer>
                      
                  <Label2> Pick a word from the card! </Label2>
                  
            </Container>
      }
      return (      
        <Container>
        {renderRight}
        </Container>
      )
    }
}
export default withRouter(DrawCard);