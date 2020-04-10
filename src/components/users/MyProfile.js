import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { MainButton } from '../../views/design/Buttons/MainScreenButtons';
import { Spinner } from '../../views/design/Spinner';


const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const ChangeForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  height: 550px;
  font-family: system-ui;
  font-size: 20px;
  font-weight: 1000;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 10px;
  background: linear-gradient(rgb(255, 165, 0), rgb(255, 140, 0));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  height: 550px;
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
  list-style: square;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

class MyProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            updatedUsername: null,
            updatedName: null
        };
    }

    async update() {
        try {
            const requestBody = JSON.stringify({
                name: this.state.name,
                username: this.state.username
            });
            // Get the user ID from the localStorage
            const id = localStorage.getItem('id');

            // HTTP PUT Request to update the user information, found by user ID
            const response = await api.put('/user/' + id, requestBody);

            // Reload the page
            window.location.reload();
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    }

    async componentDidMount() {
        try {
            const currentId = localStorage.getItem('id');
        
            const response = await api.get('/users/'+ currentId);

            this.setState({users: response.data});
    
        } catch (error) {
            alert(`Something went wrong while fetching the user: \n${handleError(error)}`);
        }
    }
    back() {
        // navigate to '/main'
        this.props.history.push('/main');
    }

    handleInputChange(key, value) {
        this.setState({[key]: value});
    }

    changeUsername() {
        // Update the state and page to rerender the page with an input field
        this.setState({updatedUsername: 'updatedUsername'})
        this.forceUpdate();
    }
    changeName() {
        // Update the state and page to rerender the page with an input field
        this.setState({updatedName: 'updatedName'});
        this.forceUpdate();
    }

    render() {
        return (
            <Container>
                <Label2> My profile </Label2>
                {!this.state.users ? (
                    <Spinner />
                ) : (
                    <div>
                        <Users>
                            <PlayerContainer>
                                <Form>
                                    <Label> Rank: </Label>
                                    {/* this.state.users.rank */}
                                </Form>
                                &nbsp;
                                {this.state.updatedUsername == 'updatedUsername' ? (
                                    <Form>
                                        <Label> Username: </Label>
                                            <InputField onChange={e => {
                                                this.handleInputChange('username', e.target.value);
                                            }}
                                        placeholder={'New username...'} />
                                    </Form>
                                    ) : (
                                    <ChangeForm>
                                        <Label> Username </Label>
                                        {this.state.user.username}
                                        <ButtonContainer>
                                            <Button 
                                                margin = "0px"
                                                width = "50%"
                                                onCLick = {() => {
                                                    this.changeUsername();
                                                }}
                                            >
                                            Change
                                            </Button>
                                        </ButtonContainer>
                                    </ChangeForm>
                                )   
                                }
                                &nbsp;
                                {this.state.updatedName == 'updatedName' ? (
                                    <Form>
                                        <Label> Name: </Label>
                                            <InputField onChange={e => {
                                                this.handleInputChange('name', e.target.value);
                                            }}
                                        placeholder={'New name...'} />
                                    </Form>
                                    ) : (
                                    <ChangeForm>
                                        <Label> Name: </Label>
                                        {this.state.user.name}
                                        <ButtonContainer>
                                            <Button 
                                                margin = "0px"
                                                width = "50%"
                                                onCLick = {() => {
                                                    this.changeName();
                                                }}
                                            >
                                            Change
                                            </Button>
                                        </ButtonContainer>
                                    </ChangeForm>
                                )   
                                }
                                &nbsp;
                                <Form>
                                    <Label> Creation date: </Label>
                                    {this.state.users.creationdate}
                                </Form>
                                &nbsp;
                                <Form>
                                    <Label> Total points: </Label>
                                    {/*this.state.users.points*/}
                                </Form>
                                &nbsp;
                                <Form>
                                    <Label> Games played: </Label>
                                    {/* this.state.users.playedgames */}
                                </Form>
                            </PlayerContainer>
                        </Users>
                        <PlayerContainer>
                            <MainButton
                                disabled = {!this.state.updatedUsername && !this.state.updatedName}
                                width = "20%"
                                onClick = {() => {
                                    this.update();
                                }}
                                >
                                Save
                            </MainButton>
                            <MainButton
                                width="20%"
                                onClick={() => {
                                    this.return();
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

export default withRouter(MyProfile);