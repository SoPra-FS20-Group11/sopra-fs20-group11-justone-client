import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Games from '../../views/Games';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import { Redirect, Route } from "react-router-dom";
import DrawCard from './DrawCard';
import Game from '../shared/models/Game';

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
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`;

const WordContainer = styled.div`
  justify-content: center;
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 25px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  width: 100%;
  height: 90px;
  border: none;
  border-radius: 5px;
  background: rgb(255, 229, 210);
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

const GameButton = styled.button`
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
  margin-left: auto;
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



class CheckWord extends React.Component {
    constructor() {
        super();
        this.state = {
            chosenWord: null,
            gameId: null,
            numAccepted: 0,
            acceptance: true
        };
    }

    async componentDidMount() {
        try {
            const gameID = localStorage.getItem('gameID');
            this.setState({ gameId: gameID });
            const response = await api.get(`/chosenword/${gameID}`);
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.setState({ chosenWord: response.data });

            this.intervalID = setInterval(
                () => this.checkChosen(),
                1000
            );

        } catch (error) {
            alert(`Something went wrong while fetching the chosen word: \n${handleError(error)}`);
        }
    }


    handleInputChange(key, value) {
        this.setState({ [key]: value });
    }

    async acceptWord(word) {
        let num = this.state.numAccepted;
        num = num + 1;
        this.setState({ numAccepted: num });
    }

    async rejectWord(chosenWord) {
        this.setState({acceptance: false})
        this.props.history.push('/overview')
    }

    checkChosen() {
        const numPlayers = localStorage.getItem('PlayersList'.length)
        if (this.state.numAccepted === numPlayers) {
            this.props.history.push(`/nextPage`);
        }
    }

    render() {
        return (
            <Container>
                <Label2> Here's the chosen word! Do you accept or reject? </Label2>
                {!this.state.clues ? (
                    <Spinner />
                ) : (
                        <GameContainer>
                            <Users>
                                <WordContainer>{this.state.chosenWord}</WordContainer>
                                <CheckButton
                                width="100%"
                                onClick={() => {
                                    this.acceptWord();
                                }}>
                                    Accept
                                    </CheckButton>
                                    <CheckButton
                                    width="100%"
                                    onClick={() => {
                                        this.rejectWord();
                                    }}>
                                        Reject
                                    </CheckButton>
                            </Users>
           
                        </GameContainer>
                    )}
            </Container>
        )
    }
}
export default withRouter(CheckWord);