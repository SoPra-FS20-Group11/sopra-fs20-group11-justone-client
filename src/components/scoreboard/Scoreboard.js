import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';

const Container = styled(BaseContainer)`
  color: grey0;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
const SearchFieldContainer = styled.li`
  display: flex;
  position: fixed; 
  margin-left: 50px;
  right: 10%;
  flex-direction: row;
  justify-content: center;
`;

const SearchButton = styled.button`
height: 35px;
font-weight: bold;
padding-left: 15px;
margin-left: 4px;
border: grey0;
border-radius: 20px;
font-weight: bold;
margin-bottom: 20px;
background: rgba(255, 255, 255, 0.2);
color: grey0;
justify-content: center;
`;

class Scoreboard extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null,
      username: null
    };
  }

  searchByUsername(username){
    const typedUsername = username;
    this.props.history.push(`/search/${typedUsername}`);
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
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

  sortByScore(a, b) {
    const user1 = a.score;
    const user2 = b.score;

    let comparison = 0;
    if (user1 < user2) {
      comparison = 1;
    } else if (user1 > user2) {
      comparison = -1;
    }
    return comparison;
  }

  async componentDidMount() {
    try {
      const response = await api.get('/users');
      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the returned users and update the state.
      this.setState({ users: response.data });
      this.state.users.sort(this.sortByScore)

      // This is just some data for you to see what is available.
      // Feel free to remove it.
      console.log('request to:', response.request.responseURL);
      console.log('status code:', response.status);
      console.log('status text:', response.statusText);
      console.log('requested data:', response.data);

      // See here to get more data.
      console.log(response);
    } catch (error) {
      alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }

  return() {
    this.props.history.push('/main');
}

render() {
  return (
    <Container>
      <Label2>Scoreboard</Label2>
      <SearchFieldContainer>
      <InputField
            placeholder="Username..."
            onChange={e => {
              this.handleInputChange('username', e.target.value);
            }} 
          />
      <SearchButton
        onClick={() => {
          this.searchByUsername(this.state.username);
          }}
      > Search
      </SearchButton>
      </SearchFieldContainer>
      {!this.state.users ? (
        <Spinner />
      ) : (
        <div>
          <Users>
            {this.state.users.map(user => {
              return (
                  <ButtonContainer key={user.id}>  
                    <PlayerButton
                      width="100%"
                      onClick={() => {
                      this.compareIds(user.id);
                      }}
                      >
                    <Player user={user} />
                  </PlayerButton>
                  </ButtonContainer>
              );
            })}
          </Users>
          <MainButton
            width="100%"
            onClick={() => {
              this.return();
            }}>
            Return
          </MainButton>
        </div>
      )}
    </Container>
  );
}
}

export default withRouter(Scoreboard);