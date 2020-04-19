import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { Spinner } from '../../views/design/Spinner';


const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled(BaseContainer)`
  color: grey0;
  text-align: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 250px;
  height: 90px;
  font-family: system-ui;
  font-size: 20px;
  font-weight: 1000;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 10px;
  background: linear-gradient(rgb(255, 165, 0), rgb(255, 140, 0));
  transition: opacity 0.5s ease, transform 0.5s ease;
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

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const Label = styled.label`
  color: grey0;
  margin-bottom: 10px;
  text-transform: none;
`;

const Label2 = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  font-size: 30px;
  text-shadow: 0 0 10px black;
  color: rgba(204, 73, 3, 1);
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
  font-size: 35px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  width: 60%;
  height: 50px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(255, 229, 153);
  transition: all 0.3s ease;
`;

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            users: null,
            updatedUsername: null,
            updatedName: null
        };
    }

    async componentDidMount() {
        try {
            const {Key} = this.props.match.params;
            const response = await api.get('/users/' + Key);
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.setState({users: response.data});
        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }
    back() {
        // navigate to '/main'
        this.props.history.push('/main');
    }

    render() {
        return (
            <Container>
                {!this.state.users ? (
                    <Spinner />
                 ) : (
                    <div>
                        <Users>
                            <PlayerContainer>
                            <Label2> User Profile of {this.state.users.username}</Label2>
                                <Form>
                                    <Label> Rank: </Label>
                                    {this.state.users.rank}
                                </Form>
                                &nbsp;
                                <Form>
                                    <Label> Username: </Label>
                                    {this.state.users.username}
                                </Form>
                                &nbsp;
                                <Form>
                                    <Label> Name: </Label>
                                    {this.state.users.name}
                                </Form>
                                &nbsp;
                                <Form>
                                    <Label> Status: </Label>
                                    {this.state.users.status}
                                </Form>
                                &nbsp;
                                <Form>
                                    <Label> Total points: </Label>
                                    {this.state.users.score}
                                </Form>
                                &nbsp;
                                <Form>
                                    <Label> Games played: </Label>
                                    {this.state.users.gamesPlayed}
                                </Form>
                            </PlayerContainer>
                        </Users>
                        <PlayerContainer>
                            <MainButton
                                width="10%"
                                onClick={() => {
                                    this.back();
                                }}
                            >
                                Return
                            </MainButton>
                        </PlayerContainer>
                    </div>
                )}
            </Container>
        );
    }
}

export default withRouter(Profile);