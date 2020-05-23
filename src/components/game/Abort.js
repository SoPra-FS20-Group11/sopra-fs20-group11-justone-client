import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';

const Container = styled(BaseContainer)`
  color: grey0;
  text-align: center;
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
  width: 100%;
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

class Abort extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  async componentDidMount() {
    try {
        const GameID = localStorage.getItem('gameID');     
        const response = await api.get('/games/'+GameID);
    
        if(response.data.status !== "FINISHED"){
          await api.put(`/games/finish/${GameID}`);
        }
    } catch (error) {
        alert(`Something went wrong while fetching the user: \n${handleError(error)}`);
    }
}

finish() {
  this.props.history.push(`/main`);
} 

  render () {
    return (
        <Container>
             <Form>Someone timed out or left the game!<div>Your game score so far was added to your personal total score!</div></Form>
             <MainButton onClick={() => {this.finish();
            }}> Return
            </MainButton>
        </Container>
    );
}
}

export default withRouter(Abort);