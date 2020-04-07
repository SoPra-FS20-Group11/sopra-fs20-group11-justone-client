import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { MainButton } from '../../views/design/Buttons/MainScreenButtons';

// for buttons

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 3em;
`;

// for Inputfields

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
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


class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            name: null,
            username: null,
            password: null
        };
    }
    async register() {
        try {
            const requestBody = JSON.stringify({
                name: this.state.name,
                username: this.state.username,
                password: this.state.password
            });
            const response = await api.post('/users', requestBody);

            this.props.history.push('/login');
            } catch (error) {
                alert(`Something went wrong during the registration: \n${handleError(error)}`);
            }
        }
    async back() {
        this.props.history.push('login');
        }

    handleInputChange(key, value) {
        this.setState({[key]: value});
        }
    componentDidMount() {}

    render() {
        return(
            <BaseContainer>
                <FormContainer>
                    <Label2> Enter your credentials </Label2>
                        <Form>
                            <Label>Name</Label>
                            <InputField 
                                placeholder= "Enter here your name..."
                                onChange={e=> {
                                    this.handleInputChange('name', e.target.value);
                                }}
                            />
                            <Label>Username</Label>
                            <InputField 
                                placeholder="Enter here your username..."
                                onChange={e=> {
                                    this.handleInputChange('username', e.target.value);
                                }}
                            />
                            <Label>Password</Label>
                            <InputField 
                                placeholder="Enter here your password..."
                                onChange={e=> {
                                    this.handleInputChange('password', e.target.value);
                                }}
                            />
                            <ButtonContainer>
                                <MainButton
                                    disabled={!this.state.name || !this.state.username || !this.state.password}
                                    width="50%"
                                    onClick={() => {
                                        this.register();
                                    }}
                                >
                                    Create Player
                                </MainButton>
                                &nbsp;
                                <MainButton
                                    width="50%"
                                    onClick={() => {
                                        this.back();
                                    }}
                                >
                                Back to Login
                                </MainButton>
                            </ButtonContainer>
                        </Form>
                </FormContainer>
            </BaseContainer>
        )
            
        }
    }
export default withRouter(Registration);

