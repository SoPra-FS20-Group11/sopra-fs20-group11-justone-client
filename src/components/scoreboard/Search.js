import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { withRouter } from 'react-router-dom';

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  width: 600px;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 50px;
`;

const Label2 = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  font-size: 60px;
  text-shadow: 0 0 10px black;
  color: rgba(240, 125, 7, 1);
  text-align: center;
`;

const PlayerButton = styled.button`
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
  color: rgba(0, 0, 0, 1);
  width: 20%;
  height: 50px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 153);
  transition: all 0.3s ease;
`;


class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null,
      foundUser: null,
      foundOne: false
    };
  }

  compareIds(userId) {
    const displayedUserId = userId;
    const currentId = localStorage.getItem('id');
    if (displayedUserId == currentId){
      this.props.history.push(`/myprofile`)
    } else {
      this.props.history.push(`/profile/${userId}`)
    }
  }

  async componentDidMount() {
    try {
      const { foundUser } = this.props.match.params;
      const response = await api.get('/users');
  

      // Get the returned users and update the state.
      this.setState({ users: response.data });

      for (var j = 0; j < this.state.users.length; j++){
        if (this.state.users[j].username == foundUser){
          this.setState({ foundUser: this.state.users[j]});
          this.setState({ foundOne: true})
        }
      }

    } catch (error) {
      alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }

  return() {
    this.props.history.push('/scoreboard');
}

  render() {
        const foundOne = this.state.foundOne;  
        let result;   
        if (!foundOne){
          result = <FormContainer><Label2>No user found!</Label2>
          <MainButton
            width="100%"
            onClick={() => {
              this.return();
            }}>
            Return
          </MainButton>
          </FormContainer>
        }else{
          result =
          <div>
          <Users>
           <PlayerButton
            width="100%"
            onClick={() => {
            this.compareIds(this.state.foundUser.id);
            }}
            >
            <Player user={this.state.foundUser} />
            </PlayerButton>
            </Users>
            &nbsp;
            <MainButton
              width="100%"
              onClick={() => {
                this.return();
              }}>
              Return
            </MainButton>
          </div>
        } 
        return (
        <Container>
        {result}
        </Container>  
      )
  }
}

export default withRouter(Search);