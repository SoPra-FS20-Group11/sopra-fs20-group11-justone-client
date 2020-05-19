import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 6px 0;
  width: 900px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff2ff;
`;

const UserName = styled.div`
  font-weight: lighter;
  margin-left: auto;
  margin-right: 10px;
`;

const Score = styled.div`
  font-weight: bold;
  color: grey0;
  margin-left: 60px;
  margin-right: 10px;
  justify-content: center;
`;

const CorrectlyGuessed = styled.div`
  font-weight: bold;
  color: grey0;
  margin-left: 60px;
  margin-right: 10px;
  justify-content: center;
`;

const GamesPlayed = styled.div`
  margin-left: 10px;
  font-weight: bold;
  margin-right: 10px;
`;



/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const ScoreboardPlayer = ({ user }) => {
  return (
    <Container>
      <UserName>Username: {user.username}</UserName> <CorrectlyGuessed>Correctly Guessed Words: {user.correctlyGuessed}</CorrectlyGuessed> <Score>Score: {user.score}</Score> <GamesPlayed>Games Played: {user.gamesPlayed}</GamesPlayed>
    </Container>
  );
};

export default ScoreboardPlayer;
