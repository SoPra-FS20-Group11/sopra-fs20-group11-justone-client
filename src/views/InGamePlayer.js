import React from "react";
import styled from "styled-components";

const GamePlayerContainer = styled.div`
  flex-direction: column;
  align-items: center;
  margin: 6px 0;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  border: 1px solid #ffffff2ff;
`;

const UserName = styled.div`
display: flex;
flex-direction: column;
align-items: center;
  font-weight: bold;
`;

const Score = styled.div`
display: flex;
flex-direction: column;
margin-top: 10px;
white-space:nowrap;
align-items: center;
  font-weight: 600;
  color: grey0;
  margin-left: 0px;
`;
const CorrectlyGuessed = styled.div`
display: flex;
flex-direction: column;
align-items: center;
  margin-top: 10px;
  font-weight: 600;
  color: grey0;
  margin-left: 0px;
`;
const GamesPlayed = styled.div`
margin-top: 10px;
  margin-left: 10px;
  font-weight: bold;
`;


/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const InGamePlayer = ({ user }) => {
  return (
    <GamePlayerContainer>
      <UserName>Player <div>{user.username}</div></UserName> 
      <Score>Score 
        <div>{user.score}</div>
      </Score> 
      <CorrectlyGuessed>Correctly Guessed Words <div>{user.correctlyGuessed}</div></CorrectlyGuessed>
    </GamePlayerContainer>
  );
};

export default InGamePlayer;