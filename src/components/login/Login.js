import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { MainButton } from '../../views/design/Buttons/MainScreenButtons';
import JustOneTitle from "../../JustOneTitle.png";
import PasswordMask from 'react-password-mask';


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
  color: rgba(240, 125, 7, 1);
  text-align: center;
`;

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null,
      password: null
    };
  }

  async login() {
    try {
      const requestBody = JSON.stringify({
        username: this.state.username,
        password: this.state.password
      });

      const response = await api.put('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('id', user.id);
      localStorage.setItem('username', user.username);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      this.props.history.push(`/main`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  }
  async register() {
    this.props.history.push('/registration');
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  componentDidMount() {}

  render() {
    return (
      <BaseContainer>
        <FormContainer>
          <img src={JustOneTitle} height={120}/> 
          <Label2>Login</Label2>
          <Form>
            <Label>Username</Label>
            <InputField 
              placeholder="Enter here your username..."
              onChange={e => {
                this.handleInputChange('username', e.target.value);
              }}
            />
            <Label>Password</Label>
            <PasswordMask
              id="password"
              name="password"
              placeholder="Enter here your password..."
              value={this.state.password}
              onChange={e => {
                this.handleInputChange('password', e.target.value);
              }}
              inputStyles={{
                height: "35px",
                border: "grey0",
                paddingLeft: "15px",
                marginLeft: "-4px",
                border: "grey0",
                borderRadius: "20px",
                fontWeight: "bold",
                background: "rgba(255, 255, 255, 0.2)"

              }}
              buttonStyles={{
                width: '80px',
                height: '40px',
                fontSize: '20px',
                marginRight: '-20px',
                marginTop: '-20px',
                borderRadius: '10px',
                background: 'rgba(255, 229, 153)',
                border: '2px',
                transition: 'all 0.3s ease'
              }} 
            />
            <ButtonContainer>
              <MainButton
                disabled={!this.state.username || !this.state.password}
                width="10%"
                onClick={() => {
                  this.login();
                }}
              >
                Login
              </MainButton>
              &nbsp;
              <MainButton
                width="10%"
                onClick={() => {
                  this.register();
                }}
              >
                Sign up
              </MainButton>
            </ButtonContainer>
          </Form>
        </FormContainer>
      </BaseContainer>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Login);


        