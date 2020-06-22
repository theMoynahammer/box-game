import React from 'react';
import ReactDOM from 'react-dom';
// import ImageMapper from 'react-image-mapper';
// import cloneDeep from 'lodash/cloneDeep';
import { evaluateGuess, formatRemainingCardsCount } from './logic-functions/helperFunctions';
import { getInitialBoardAndCardsRemaining, getInitialState } from './logic-functions/setUpInitialBoard';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function Square(props) {
    return (
        // <button className="square" onClick={props.onClick}>
        // <button className="square" 
        // onClick={props.onClick}
        // >
        // <ImageMapper src={props.imgPath} 
        // className="square"
        // onClick={props.onClick}
        // alt="nothing loaded :("/>
        // map={AREAS_MAP}/>
        // <div>
        <div style={{ width: 'auto', height: 'auto', maxWidth: '30vw', maxHeight: '350px', position: 'relative' }}>
            {/* <div className="square"> */}
            {/* <img src={props.imgPath} alt="nothing loaded :("></img> */}
            {props.spotIsStillValid ? <div onClick={props.guessHigher} className="higher-button"></div> : null}
            <ResponsiveEmbed aspectRatio="1by1">
                {/* <embed type="image/svg" src={props.imgPath} /> */}
                <Image src={props.imgPath} alt="nothing loaded :(" ></Image>
            </ResponsiveEmbed>
            {props.spotIsStillValid ? <div onClick={props.guessLower} className="lower-button"></div> : null}
            {/* <Image src={props.imgPath} alt="nothing loaded :(" responsive></Image> */}
            {/* <img className="cards-class" src={props.imgPath} alt="nothing loaded :("></img> */}
            {/* {props.spotIsStillValid ?
                [
                    <button onClick={props.guessHigher} >Higher</button>,
                    <button onClick={props.guessSamesies} >Samesies</button>,
                    <button onClick={props.guessLower} >Lower</button>,
                    // <button onClick={props.guessHigher} className="top-button">Higher</button>,
                    // <button onClick={props.guessSamesies} className="middle-button">Samesies</button>,
                    // <button onClick={props.guessLower} className="bottom-button">Lower</button>,
                ]
                : null} */}
            {/* {props.spotIsStillValid ? <button onClick={props.guessLower}
                // className="bottom-button">Lower</button> : null} */}
        </div>
        // </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                guessLower={() => this.props.evaluateGuess(i, 'Lower')}
                guessSamesies={() => this.props.evaluateGuess(i, 'Samesies')}
                guessHigher={() => this.props.evaluateGuess(i, 'Higher')}
                imgPath={this.props.squares[i].imgPath}
                spotIsStillValid={this.props.squares[i].spotIsStillValid}
            />
        );
    }

    render() {
        return (
            <div>
                {/* <div className="board-row"> */}
                <Row className="refactored-row">
                    <Col className="text-center">
                        {this.renderSquare(0)}
                    </Col>
                    <Col className="text-center">
                        {this.renderSquare(1)}
                    </Col>
                    <Col className="text-center">
                        {this.renderSquare(2)}
                    </Col>
                </Row>
                <Row className="refactored-row">
                    <Col className="text-center">
                        {this.renderSquare(3)}
                    </Col>
                    <Col className="text-center">
                        {this.renderSquare(4)}
                    </Col>
                    <Col className="text-center">
                        {this.renderSquare(5)}
                    </Col>
                </Row>
                <Row className="refactored-row">
                    <Col className="text-center">
                        {this.renderSquare(6)}
                    </Col>
                    <Col className="text-center">
                        {this.renderSquare(7)}
                    </Col>
                    <Col className="text-center">
                        {this.renderSquare(8)}
                    </Col>
                </Row>
                {/* </div> */}
                {/* <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div> */}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        const { cardsRemaining, initialBoard } = getInitialBoardAndCardsRemaining();
        const initialState = getInitialState(cardsRemaining, initialBoard);
        this.state = {
            gameState: [initialState],
            isThePlayerACheater: false,
        }
    }

    previousCard = null;
    previousGuess = null;
    cardDrawn = null;
    numberOfSamesies = 0;
    formattedCardsRemainingList = null;

    async handleGuessAndManageState(i, higherLowerOrSamesies) {
        const currentState = { ...this.state.gameState[this.state.gameState.length - 1] };
        const { newState } = evaluateGuess(i, higherLowerOrSamesies, currentState);
        const { cardDrawn, previousCard, numberOfSamesies, previousGuess } = newState;
        this.cardDrawn = cardDrawn;
        this.previousCard = previousCard;
        this.numberOfSamesies = numberOfSamesies;
        this.previousGuess = previousGuess;
        this.formattedCardsRemainingList = formatRemainingCardsCount(newState.cardsRemaining)
        await this.setState({
            gameState: [...this.state.gameState, newState]
        });
    }

    handleCheatingCheckbox = (event) => {
        this.formattedCardsRemainingList = event.target.checked ? formatRemainingCardsCount(this.state.gameState[this.state.gameState.length - 1].cardsRemaining) : null;
        this.setState({ isThePlayerACheater: event.target.checked })
    }

    render() {
        return (
            // <React.Fragment>
            <Container fluid='md'>
                <div class="box-game-header"><Image style={{ width: '30px' }} src="/favicon.ico"></Image>{`The Box Game`}</div>
                <Row>
                    <Col xs={2} className="infoDiv">
                        {/* <div className="infoDiv"> */}
                            <div class="box-game-info">Cards remaining: {this.state.gameState[this.state.gameState.length - 1].cardsRemaining.length}</div>
                            <div class="box-game-info">Previous guess: {this.previousGuess}</div>
                            <div class="box-game-info">Card drawn: {this.cardDrawn}</div>
                            <div class="box-game-info">Previous card: {this.previousCard}</div>
                            <div class="box-game-info">Number of samesies: {this.numberOfSamesies}</div>
                            <label>
                                Would you like to cheat?
                            <input
                                    name="isThePlayerACheater"
                                    type="checkbox"
                                    checked={this.state.isThePlayerACheater}
                                    onChange={this.handleCheatingCheckbox} />
                            </label>
                            {/* {this.state.gameState[this.state.gameState.length - 1].gameLost === true ? <h1 style={{ color: "red" }}>You Lose, Idiot!</h1> : null} */}
                            {this.state.gameState[this.state.gameState.length - 1].gameWon === true ? <h4>You Win! You're a genius!</h4> : null}
                            {this.state.isThePlayerACheater ? this.formattedCardsRemainingList.map((card) => <div>{card}</div>) : null}

                        {/* </div> */}
                        {/* <div className="game"> */}
                        {/* <div className="game-board"> */}
                    </Col>
                    <Col>
                        {this.state.gameState[this.state.gameState.length - 1].gameLost === true ? <div style={{ color: "red" }}><h1>You Lose, Idiot!</h1><Button onClick={()=>window.location.reload()}variant="secondary">Play Again?</Button></div> :
                            <Board
                                squares={this.state.gameState[this.state.gameState.length - 1].currentBoard}
                                evaluateGuess={(i, higherLowerOrSamesies) => this.handleGuessAndManageState(i, higherLowerOrSamesies)}
                            />}
                        {/* </div> */}
                        {/* <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div> */}
                        {/* </div> */}
                    </Col>
                </Row>
            </Container>
            // </React.Fragment>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
