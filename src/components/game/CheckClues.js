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
`;

const ClueContainer = styled.div`
  margin-top: 20px;
  flex-direction: row;
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 35px;
  text-align: right;
  color: rgba(0, 0, 0, 1);
  width: 100%;
  height: 100px;
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
  margin-top: 2em;
  margin-left: 20px;
  margin-right: 20px;
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  width: 15%;
  color: rgba(0, 0, 0, 1);
  height: 30px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(230, 180, 100);
  transition: all 0.3s ease;
`

const ClueLabel = styled.h1`
  position: absolute;
  justify-content: center;
  text-align: left;
  font-family: system-ui;
  font-weight: bold;
  font-size: 40px;
  margin-left: 30px;
`;


class CheckClues extends React.Component {
    intervalID;

    constructor() {
        super();
        this.state = {
            clues: null,
            gameId: null,
            numchosen: 0,
            color: null,
            decidedClues: [],
            colorAcc: [],
            colorRej: [],
            numdecidedClues: 0,
        };
    }

    async componentDidMount() {
        try {
            const gameID = localStorage.getItem('gameID');
            this.setState({ gameId: gameID });
            const response = await api.get(`/clues/${gameID}`);

            await new Promise(resolve => setTimeout(resolve, 1000));

            this.setState({ clues: response.data });

            this.intervalID = setTimeout(
                () => this.checkChosen(),
                7000
            );

            const colorArrayAcc = [];
            const colorArrayRej = [];
            for (var i = 0; i < this.state.clues.clues.length; i++) {
                colorArrayAcc.push('#000000')
                colorArrayRej.push('#000000')}
            this.setState({ colorAcc: colorArrayAcc });
            this.setState({ colorRej: colorArrayRej });

            const decidedClueArray = [];
            for (var i = 0; i < this.state.clues.clues.length; i++) {
                decidedClueArray.push('0');}
            this.setState({ decidedClues: decidedClueArray });

        } catch (error) {
            alert(`Something went wrong while fetching the clues: \n${handleError(error)}`);
        }
    }

    componentWillUnmount() {
        clearTimeout(intervalID);
      }

    handleInputChange(key, value) {
        this.setState({ [key]: value });
    }

    async acceptClue(index) {
        const colorArrayAcc = this.state.colorAcc;
        const decidedClueArray = this.state.decidedClues;
        for (var i = 0; i < this.state.clues.clues.length; i++) {
            if(i==index){
                colorArrayAcc[i] = '#03AC13';
                decidedClueArray[i] = '1';
            }
        }
        
        this.setState({ decidedClues: decidedClueArray });
        this.setState({ colorAcc: colorArrayAcc });
        this.setState({ numdecidedClues: this.state.numdecidedClues+1 });
    }

    async rejectClue(clue, index) {
        const requestBody = JSON.stringify({
            clue: clue
        });
        const response = await api.put(`/clues/${this.state.gameId}`, requestBody);

        const colorArrayRej = this.state.colorRej;
        const decidedClueArray = this.state.decidedClues;
        for (var i = 0; i < this.state.clues.clues.length; i++) {
            if(i==index){
                colorArrayRej[i] = '#FF0000';
                decidedClueArray[i] = '1';
            }
        }
        this.setState({ decidedClues: decidedClueArray });
        this.setState({ colorRej: colorArrayRej });
        this.setState({ numdecidedClues: this.state.numdecidedClues+1 });
    }

    checkChosen() {
        if (this.state.numdecidedClues >= this.state.clues.clues.length) {
            this.props.history.push(`/games/waiting2`);
        }
    }

    render() {
        return (
            <Container>
                <Label2> Here you see the clues! Check if they are acceptable! </Label2>
                {!this.state.clues ? (
                    <Spinner />
                ) : (
                        <GameContainer>
                            <Users>
                                {this.state.clues.clues.map((clues, i) => {    
                                                                
                                    return (                              
                                        <ClueContainer key={clues.id}>
                                            <ClueLabel >
                                                {clues}
                                            </ClueLabel>
                                            <CheckButton
                                                disabled={this.state.decidedClues[i]==='1'}
                                                style={{color: this.state.colorAcc[i]}}
                                                width="100%"
                                                    onClick={() => {
                                                        this.acceptClue(i);
                                                }}>
                                                Accept
                                            </CheckButton>
                                            <CheckButton
                                                disabled={this.state.decidedClues[i]==='1'}
                                                style={{color: this.state.colorRej[i]}}  
                                                width="100%"
                                                    onClick={() => {
                                                    this.rejectClue(clues, i);
                                                }}>
                                                Reject
                                            </CheckButton>
                                        </ClueContainer>
                                    );
                                })}
                            </Users>
           
                        </GameContainer>
                    )}
            </Container>
        )
    }
}
export default withRouter(CheckClues);