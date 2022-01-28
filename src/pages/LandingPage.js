import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const LandingPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  button {
    width: 300px;
    height: 40px;
    background-color: #cc9900;
    color: white;
  }
`;

const LandingPage = () => {
  return (
    <LandingPageWrapper>
      <h2>The Box Game</h2>
      <img
        src={process.env.PUBLIC_URL + "/box-game-logo.png"}
        width="150"
        height="150"
        alt="The Box Game"
      />
      <br />
      <div>
        <Link to="/single-player">
          <button>Single Player</button>
        </Link>

        <br />
        <br />
        <Link to="/multiplayer/1">
          <button>Multiplayer Room #1</button>
        </Link>
      </div>
    </LandingPageWrapper>
  );
};

export default LandingPage;
