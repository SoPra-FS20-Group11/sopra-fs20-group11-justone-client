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
  flex-direction: row;
  justify-content: center;
  margin-top: 1px;
`;

const Label2 = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  font-size: 30px;
  text-shadow: 0 0 10px black;
  color: rgba(204, 73, 3, 1);
  text-align: center;
`;

const RoundLabel = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  text-decoration: underline;
  font-size: 40px;
  margin-top: 30px;
  text-shadow: 0 0 10px black;
  color: rgba(204, 73, 3, 1);
  text-align: center;
`;

const ImgContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  justify-content: center;
`;

const JustOneDeck = styled.img`
  justify-content: center;
  
`;
const JustOneNext = styled.img`
  position: absolute;
  margin-left: 10em;
`;

export const WordButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 20px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 35px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 153);
  transition: all 0.3s ease;
`;

class DrawCard extends React.Component {
    constructor() {
        super();
        this.state = {
            users: null,
            drawnCardBool: false,
            card: null,
            round: null
        };
    }
    async componentDidMount() {
      const gameID = localStorage.getItem('gameID');
      const response = await api.get(`/games/${gameID}`);

      this.setState({round: response.data.round});
    }

    async drawNewCard() {
      this.setState({drawnCardBool: true});
      this.forceUpdate();
      const gameID = localStorage.getItem('gameID');
      const response = await api.put(`/cards/${gameID}`);
      this.setState({card: response.data.words});
    }

    async setChosenWord(wordNum){
      const number = wordNum-1;
      const gameID = localStorage.getItem('gameID');
      const requestBody = JSON.stringify({
        chosenWord: this.state.card[number]
      });
      await api.put('/chosenword/'+gameID, requestBody)
    }

    render() {
      const drawnCardBool = this.state.drawnCardBool;
      let renderRight;   
      const numbers = [1, 2, 3, 4, 5];
      if (!drawnCardBool){
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
                <JustOneNext src={JustOneCards} alt= "Just One Cards" height={420} />       
                </ImgContainer>        
                  <Label2> Pick a word from the card! </Label2>
                  <ButtonContainer>
                    {numbers.map((number) => {
                      return (               
                        <ButtonContainer key={number}> 
                        <WordButton                     
                            width="100%"
                            onClick={() => {
                                this.setChosenWord(number);
                                this.props.history.push(`/games/waiting1`);                   
                            }}
                          >                        
                          <div> {number}</div>             
                    </WordButton>
                    </ButtonContainer>);})}
                </ButtonContainer>
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