import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { MainButton } from '../../views/design/Buttons/MainScreenButtons';
import JustOneCards from '../../JustOneCards.png';
import JustOneSingle from '../../JustOneSingle.png';


const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
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
  margin-top: 2em;
  margin-left: -200px;
  margin-right: 250px;
  position: relative;
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
  
`;
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const JustOneDeck = styled.img`
  position: relative;
  justify-content: center;
`;
const JustOneDeckDrawn = styled.img`
  position: relative;
  justify-content: center;
  margin-left: 100px;
`;
const JustOneNext = styled.img`
  margin-top: -370px;
  position: relative;
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
  _isMounted = false;
    constructor() {
        super();
        this.state = {
            isLoading: true,
            users: null,
            drawnCardBool: false,
            card: null,
            round: null,
            chosenWordStatus: null,
            gameID: null,
            disabledButton: false
        };
    }
    async componentDidMount() {
      
      localStorage.setItem('currentPage', 7);
      this._isMounted = true;
      const gameID = localStorage.getItem('gameID');
      await api.get(`/games/${gameID}`).then(response => {
        if (this._isMounted) {
        this.setState({
          round: response.data.round,
          })
        }
        localStorage.setItem('currentPlayer', response.data.currentUserId);
      })

      await api.get(`/chosenword/${gameID}`).then(responseChosenWord => {
        if (this._isMounted) {
          this.setState({
            isLoading: false,
            chosenWordStatus: responseChosenWord.data.wordStatus
          })
        }
      })
      this.timeOut = setTimeout(() => { this.props.history.push('/games/abort') }, 90000);
    }

    componentWillUnmount() {
      this._isMounted = false;
      clearTimeout(this.timeOut);
    }

    async drawNewCard() {
      this.setState({drawnCardBool: true});
      this.forceUpdate();

      const gameID = localStorage.getItem('gameID');
      const response = await api.put(`/cards/${gameID}`);
      this.setState({card: response.data.words});

      var cardarray = [];
      for (var i = 0; i < response.data.words.length; i++) {
        cardarray.push(response.data.words[i])}
    }

    async setChosenWord(wordNum){
      const gameID = localStorage.getItem('gameID');
      localStorage.setItem('wordnum', wordNum);
      const response = await api.get(`/cards/${gameID}`);
      this.setState({
        card: response.data.words,
        disabledButton: true});
      const number = wordNum-1;
      var requestBody = JSON.stringify({
        chosenWord: this.state.card[number]
      })
      this.putrequest(requestBody);
    }

    async putrequest(requestBody){
      const gameID = localStorage.getItem('gameID');
      await new Promise(resolve => setTimeout(resolve, 3500));
      await api.put('/chosenword/'+gameID, requestBody).then(result => {
        this.props.history.push(`/games/waiting1`);
      })
    }

    render() {
      const drawnCardBool = this.state.drawnCardBool;
      const chosenWordStatus = this.state.chosenWordStatus;
      let renderRight;   
      const numbers = [1, 2, 3, 4, 5];
      return (
      !drawnCardBool && chosenWordStatus === "NOCHOSENWORD" ? (
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
            </Container>)
      : (
            <Container>
              <RoundLabel> Round {this.state.round} </RoundLabel>
                <ImgContainer>
                <JustOneDeckDrawn src={JustOneSingle} alt= "Just One Cards" height={380} />
                <CardContainer>
                <ButtonContainer2>
                    {numbers.map((number) => {
                      return (               
                        <ButtonContainer key={number}> 
                        <WordButton
                            disabled={(number==localStorage.getItem('wordnum') && chosenWordStatus != "NOCHOSENWORD") || this.state.disabledButton}                   
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
                </CardContainer>     
                </ImgContainer>                     
                  <Label2> Pick a word from the card! </Label2>  
            </Container>))
    }
}
export default withRouter(DrawCard);