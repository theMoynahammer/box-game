import React from 'react';
import ReactDOM from 'react-dom';
// import ImageMapper from 'react-image-mapper';
// import cloneDeep from 'lodash/cloneDeep';
import { evaluateGuess, formatRemainingCardsCount } from './logic-functions/helperFunctions';
import { getInitialBoardAndCardsRemaining, getInitialState } from './logic-functions/setUpInitialBoard';
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
        <div className="square">
            <img className="cards-class" src={props.imgPath} alt="nothing loaded :("></img>
            {props.spotIsStillValid ?
                [
                    <button onClick={props.guessHigher} className="top-button">Higher</button>,
                    <button onClick={props.guessSamesies} className="middle-button">Samesies</button>,
                    <button onClick={props.guessLower} className="bottom-button">Lower</button>,
                ]
                : null}
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
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
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
        this.formattedCardsRemainingList = event.target.checked ? formatRemainingCardsCount(this.state.gameState[this.state.gameState.length-1].cardsRemaining) :  null;
        this.setState({isThePlayerACheater: event.target.checked})
    }

    render() {
        return (
            <div className="game">
                <div className="infoDiv">
                    <h1>{`The Box Game`}</h1>
                    <h3>Cards remaining: {this.state.gameState[this.state.gameState.length - 1].cardsRemaining.length}</h3>
                    <h3>Previous guess: {this.previousGuess}</h3>
                    <h3>Card drawn: {this.cardDrawn}</h3>
                    <h3>Previous card: {this.previousCard}</h3>
                    <h3>Number of samesies: {this.numberOfSamesies}</h3>
                    <label>
                        Would you like to cheat?
                    <input
                            name="isThePlayerACheater"
                            type="checkbox"
                            checked={this.state.isThePlayerACheater}
                            onChange={this.handleCheatingCheckbox} />
                    </label>
                    {this.state.gameState[this.state.gameState.length - 1].gameLost === true ? <h1 style={{ color: "red" }}>You Lose, Idiot!</h1> : null}
                    {this.gameWon === true ? <h4>You Win, Genius!</h4> : null}
                    {this.state.isThePlayerACheater ? this.formattedCardsRemainingList.map((card)=> <div>{card}</div>): null}

                </div>
                <div className="game-board">
                    <Board
                        squares={this.state.gameState[this.state.gameState.length - 1].currentBoard}
                        onClick={i => this.handleClick(i)}
                        evaluateGuess={(i, higherLowerOrSamesies) => this.handleGuessAndManageState(i, higherLowerOrSamesies)}
                    />
                </div>
                {/* <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div> */}
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
