import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 6px 0;
  width: 500px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 0px solid #ffffff2ff;
`;

const UserName = styled.div`
  font-weight: lighter;
  margin-right: 50px;
  margin-left: 50px;
  justify-content: center;
`;

const Name = styled.div`
  font-weight: bold;
  color: grey0;
  justify-content: center;
`;

const Id = styled.div`
  margin-left: auto;
  margin-right: 50px;
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
const Player = ({ user }) => {
  return (
    <Container>
      <Name>{user.name}</Name> <UserName>{user.username}</UserName>
      <Id>Id: {user.id}</Id>
    </Container>
  );
};

export default Player;
