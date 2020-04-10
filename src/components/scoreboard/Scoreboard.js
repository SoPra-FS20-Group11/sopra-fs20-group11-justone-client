import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';

const Container = styled(BaseContainer)`
  color: white;
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

class Scoreboard extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null
    };
  }

  async logout() {

    const currentId = localStorage.getItem('id');
    const requestBody = JSON.stringify({
      username: null,
      password: null,
      id: currentId
    });
    await api.put('/logout', requestBody);
    // Get the returned user and update a new object.
    
    localStorage.clear();
    this.props.history.push('/login');
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
      const response = await api.get('/users');
      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the returned users and update the state.
      this.setState({ users: response.data });

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
        <h2>Scoreboard</h2>
        {!this.state.users ? (
          <Spinner />
        ) : (
          <div>
            <Users>
              {this.state.users.map(user => {
                return (
                    <ButtonContainer key={user.id}> 
                        
                        <button
                            width="100%"
                            onClick={() => {
                              this.compareIds(user.id);
                            }}
                        >
                            <Player user={user} />
                    </button>

                    </ButtonContainer>
                );
              })}
            </Users>
            <Button
            width="100%"
            onClick={() => {
                this.return();
            }}>
                Return
                </Button>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(Scoreboard);