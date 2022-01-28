import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Square } from "./";

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        guessLower={() => this.props.evaluateGuess(i, "lower")}
        guessSamesies={() => this.props.evaluateGuess(i, "samesies")}
        guessHigher={() => this.props.evaluateGuess(i, "higher")}
        imgPath={this.props.squares[i].imgPath}
        spotIsStillValid={this.props.squares[i].spotIsStillValid}
      />
    );
  }

  backgroundImageNames = {
    earth: "earth.jpg",
    mars: "mars.jpg",
    amEx: "amEx.png",
    darkPattern: "darkPattern.jpg",
    moon: "moon.jpg",
    underwater: "underwater.jpg",
    wood: "woodimage.jpg",
  };

  render() {
    return (
      <div
        id="main-game-board"
        style={{
          backgroundSize: "cover",
          // backgroundRepeat: 'no-repeat',
          backgroundPosition: "center",
          backgroundImage: `url(${process.env.PUBLIC_URL}/${
            this.backgroundImageNames[this.props.selectedBackground]
          })`,
          padding: "10px 0px",
        }}
      >
        {/* <Container fluid> */}
        {/* <Container fluid> */}
        {/* <Row className="refactored-row"> */}
        <div className="board-row">
          {/* TODO use card-box class and center everything */}
          <div className="card-square-div">{this.renderSquare(0)}</div>
          <div className="card-square-div">{this.renderSquare(1)}</div>
          <div className="card-square-div">{this.renderSquare(2)}</div>
          {/* </Row> */}
        </div>
        <div className="board-row">
          <div className="card-square-div">{this.renderSquare(3)}</div>
          <div className="card-square-div">{this.renderSquare(4)}</div>
          <div className="card-square-div">{this.renderSquare(5)}</div>
        </div>
        <div className="board-row">
          {/* <Row className="refactored-row"> */}
          <div className="card-square-div">{this.renderSquare(6)}</div>
          <div className="card-square-div">{this.renderSquare(7)}</div>
          <div className="card-square-div">{this.renderSquare(8)}</div>
        </div>
        {/* </Container> */}
        {/* </Container> */}
      </div>
    );
  }
}

export default Board;
