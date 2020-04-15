import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { MainButton } from '../../views/design/Buttons/MainScreenButtons';
import JustOneCards from '../../JustOneCards.png';

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
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
  margin-top: 1px;
`;

const Label2 = styled.h1`
  font-weight: bold;
  font-family: system-ui;
  font-size: 30px;
  text-shadow: 0 0 10px black;
  color: rgba(204, 73, 3, 1);
  text-align: center;
`;

const JustOneCard = styled.img`
  justify-content: center;
  margin-top: 2em;
  margin-left: 22em;
`;


class DrawCard extends React.Component {
    constructor() {
        super();
        this.state = {
            users: null
        };
    }

    drawNewCard() {
        this.props.history.push(`/wordselection`);
    }

    render() {
        return (
            <Container>
                <JustOneCard src={JustOneCards} alt= "Just One Cards" height={400} />
                <ButtonContainer>
                    <Label2> Draw a card from the stack! </Label2>
                    <MainButton
                        width="100%"
                        onClick={() => {
                            this.drawNewCard();
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