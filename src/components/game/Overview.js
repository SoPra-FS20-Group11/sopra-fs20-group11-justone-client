import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import InGamePlayer from '../../views/InGamePlayer';
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

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: row;

  margin-top: 20px;
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

const InGamePlayerField = styled.li`
  padding: 0px;
  box-shadow: 3px 3px 5px 4px;
  font-family: system-ui;
  font-weight: 900;
  font-size: 25px;
  text-align: start;
  color: rgba(0, 0, 0, 1);
  width: 300px;
  height: 300px;
  border: none;
  border-radius: 5px;
  background: rgb(255, 229, 210);
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
  width: 70%;
  height: 50px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 153);
  transition: all 0.3s ease;
  margin-top: 10px;
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

class Overview extends React.Component {
  constructor() {
    super();
    this.state = {
        users: null,
        userIds: [],
        allUsers: null,
 
    };
  }

  async componentDidMount() {
    try {
        const GameID = localStorage.getItem('gameID');
  
        const responseUsers = await api.get('/users');
        this.setState({ allUsers : responseUsers.data});

        const response = await api.get('/games/'+GameID);
        this.setState({users: response.data.usersIds});

        const uniqueSet = new Set(this.state.users);
        const uniqueUsers = [...uniqueSet];
        const UserList = [];
        for (var j = 0; j < uniqueUsers.length; j++){
            for (var i = 0; i < this.state.allUsers.length; i++) {
                if (uniqueUsers[j] == this.state.allUsers[i].id){
                    UserList.push(this.state.allUsers[i]);
                }
            }
        }

        this.setState({userIds: UserList});

    } catch (error) {
        alert(`Something went wrong while fetching the user: \n${handleError(error)}`);
    }
}

  render () {
    return (
        <Container>
            <Label2> Game: {localStorage.getItem('gameID')} </Label2>
            {!this.state.userIds ? (
                <Spinner />
            ) : (
                <div>
                    <Users>
                        {this.state.userIds.map(user => {
                            return (
                                <PlayerContainer key={user.id}>
                                    <InGamePlayerField>
                                        <InGamePlayer user={user} />
                                    </InGamePlayerField>
                                </PlayerContainer>
                            );
                        })}
                    </Users>
                </div>
            )}
        </Container>
    );
}
}

export default withRouter(Overview);