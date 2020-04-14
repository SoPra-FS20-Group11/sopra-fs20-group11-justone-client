import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { MainButton } from '../../views/design/Buttons/MainScreenButtons';


const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const RulesButtonContainer = styled.div`
  display: flex;
  direction: rtl;
  margin-top: 4em;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 3em;
`;

class DrawCard extends React.Component {
    constructor() {
        super();
        this.state = {
            users: null
        };
    }

    draw() {
        this.props.history.push(`/wordselection`);
    }

    render() {
        return (
            <Container>
                <ButtonContainer>
                    Draw a card from the stack!
                    <MainButton
                        width="100%"
                        onClick={() => {
                            this.draw();
                        }}
                    >
                    Draw a card
                    </MainButton>
                </ButtonContainer>
            </Container>
        );
    }
}
export default withRouter(DrawCard);