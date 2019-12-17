import React from 'react';
import ReactDOM from 'react-dom';
import ImageMapper from 'react-image-mapper';
import cloneDeep from 'lodash/cloneDeep';
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
            <img src={props.imgPath}
                // className="square"
                onClick={() => console.log(props)}
                alt="nothing loaded :("></img>
            {props.spotIsStillValid ? <button onClick={props.guessHigher}
                className="top-button">Higher</button> : null}
            {props.spotIsStillValid ? <button onClick={props.guessLower}
                className="bottom-button">Lower</button> : null}
        </div>
        // </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                // value={this.props.squares[i]}
                guessHigher={() => this.props.guessHigher(i)}
                guessLower={() => this.props.guessLower(i)}
                // displayValue = {this.props.squares[i].displayValue}
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
        this.state = {
            gameState: [],
            boardInitialized: false,
        }
        // {
        // history: [],
        // stepNumber: 0,
        // xIsNext: true
        // };
    }

    // handleClick(i) {
    //     const history = this.state.history.slice(0, this.state.stepNumber + 1);
    //     const current = history[history.length - 1];
    //     const squares = current.squares.slice();
    //     if (calculateWinner(squares) || squares[i]) {
    //         return;
    //     }
    //     squares[i] = this.state.xIsNext ? "X" : "O";
    //     this.setState({
    //         history: history.concat([
    //             {
    //                 squares: squares
    //             }
    //         ]),
    //         stepNumber: history.length,
    //         xIsNext: !this.state.xIsNext
    //     });
    // }


    getRandomCardIndex(lengthOfCardsRemainingArray) {
        return Math.floor(Math.random() * lengthOfCardsRemainingArray);
    }

    async guessHigher(i) {
        const currentState = { ...this.state.gameState[this.state.gameState.length - 1] };
        const newState = cloneDeep(currentState);
        const currentCard = currentState.currentBoard[i];
        const currentCardStrength = currentCard.strength;

        const stateFormat = { ...this.stateFormat };
        const newRandomCardIndex = this.getRandomCardIndex(newState.cardsRemaining.length);
        const chosenCardDetails = newState.cardsRemaining[newRandomCardIndex];
        this.cardDrawn = `${chosenCardDetails.name ? chosenCardDetails.name : chosenCardDetails.displayValue} of ${chosenCardDetails.suit}`;
        this.previousCard = `${currentCard.name ? currentCard.name : currentCard.displayValue} of ${currentCard.suit}`;
        const chosenCardStrength = chosenCardDetails.strength;
        if (chosenCardStrength === currentCardStrength) this.numberOfSamesies++;
        newState.cardsRemaining.splice(newRandomCardIndex, 1);
        newState.turnNumber++;
        newState.currentBoard[i] = chosenCardStrength > currentCardStrength ? chosenCardDetails : {
            spotIsStillValid: false,
            imgPath: `/x-image.png`
        };
        newState.cardsRemovedFromDeck.push(chosenCardDetails);
        await this.setState({
            gameState: [...this.state.gameState, newState]
        });

        // console.log(this.state.gameState)
        // const cardsRemaining = 
        // const indexOfChosenCard = this.getRandomCardIndex(cardsRemaining.length);
        // const chosenCardDetails = cardsRemaining[indexOfChosenCard];
        // cardsRemaining.splice(indexOfChosenCard, 1);
        // console.log(this.state.gameState)
        // alert(JSON.stringify(this.currentBoard[i]));
    }

    previousCard = null;
    cardDrawn = null;
    numberOfSamesies = 0;

    async guessLower(i) {
        const currentState = { ...this.state.gameState[this.state.gameState.length - 1] };
        const newState = cloneDeep(currentState);
        const currentCard = currentState.currentBoard[i];
        const currentCardStrength = currentCard.strength;
        const stateFormat = { ...this.stateFormat };
        const newRandomCardIndex = this.getRandomCardIndex(newState.cardsRemaining.length);
        const chosenCardDetails = newState.cardsRemaining[newRandomCardIndex];
        this.cardDrawn = `${chosenCardDetails.name ? chosenCardDetails.name : chosenCardDetails.displayValue} of ${chosenCardDetails.suit}`;
        this.previousCard = `${currentCard.name ? currentCard.name : currentCard.displayValue} of ${currentCard.suit}`;
        const chosenCardStrength = chosenCardDetails.strength;
        if (chosenCardStrength === currentCardStrength) this.numberOfSamesies++;
        newState.cardsRemaining.splice(newRandomCardIndex, 1);
        newState.turnNumber++;
        newState.currentBoard[i] = chosenCardStrength < currentCardStrength ? chosenCardDetails : {
            spotIsStillValid: false,
            imgPath: `/x-image.png`
        };
        newState.cardsRemovedFromDeck.push(chosenCardDetails);
        await this.setState({
            gameState: [...this.state.gameState, newState]
        });
    }

    stateFormat = {
        // const stateFormat = {
        turnNumber: null,
        cardsRemaining: null,
        currentBoard: null,
        cardsRemovedFromDeck: null,
        // }
    }

    render() {
        // // const history = this.state.history;
        // // const current = history[this.state.stepNumber];
        // // const winner = calculateWinner(current.squares);

        // const moves = history.map((step, move) => {
        //     const desc = move ?
        //         'Go to move #' + move :
        //         'Go to game start';
        //     return (
        //         <li key={move}>
        //             <button onClick={() => this.jumpTo(move)}>{desc}</button>
        //         </li>
        //     );
        // });

        // let status;
        // if (winner) {
        //     status = "Winner: " + winner;
        // } else {
        //     status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        // }
        const allCards = require('./data-structures/all-cards');
        const emptyBoardArray = [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        ];

        // const stateHistory = [];

        // const stateFormat = {
        //     turnNumber: null,
        //     cardsRemaining: null,
        //     currentBoard: null,
        //     cardsRemovedFromDeck: null,
        // }

        // const getLatestState = () => stateHistory[stateHistory.length - 1];

        // const getRandomCardIndex = (lengthOfCardsRemainingArray) => Math.floor(Math.random() * lengthOfCardsRemainingArray);

        const getInitialBoardAndCardsRemaining = () => {
            const cardsRemaining = [...allCards];
            const initialBoard = emptyBoardArray.map((item) => {
                const indexOfChosenCard = this.getRandomCardIndex(cardsRemaining.length);
                const chosenCardDetails = cardsRemaining[indexOfChosenCard];
                cardsRemaining.splice(indexOfChosenCard, 1);
                return chosenCardDetails
            });

            return {
                cardsRemaining,
                initialBoard,
            }
        };

        const saveInitialState = (cardsRemaining, initialBoard) => {
            const initialState = { ...this.stateFormat };
            initialState.turnNumber = 0;
            initialState.cardsRemaining = cardsRemaining;
            initialState.currentBoard = initialBoard;
            initialState.cardsRemovedFromDeck = [...initialBoard];
            // this.setState({
            //     gameState: [...this.state.gameState, initialState],
            //     //         history: history.concat([
            //     //             {
            //     //                 squares: squares
            //     //             }
            //     //         ]),
            //     //         stepNumber: history.length,
            //     //         xIsNext: !this.state.xIsNext
            //     //     });
            this.state.gameState.push(initialState);
            // });
        }
        if (!this.state.boardInitialized) {
            const { cardsRemaining, initialBoard } = getInitialBoardAndCardsRemaining();
            // this.currentBoard = initialBoard;
            saveInitialState(cardsRemaining, initialBoard);
            this.state.boardInitialized = true;
        }
        return (
         
            <div className="game">
                <div className="infoDiv">
            <h1>{`The Box Game`}</h1>
            <h3>Cards remaining: {this.state.gameState[this.state.gameState.length-1].cardsRemaining.length}</h3>
        <h3>Card drawn: {this.cardDrawn}</h3>
        <h3>Previous card: {this.previousCard}</h3>
    <h3>Number of samesies: {this.numberOfSamesies}</h3>
            </div>
                <div className="game-board">
                    <Board
                        // squares={current.squares}
                        squares={this.state.gameState[this.state.gameState.length - 1].currentBoard}
                        // squares={this.state.gameState[0].currentBoard}
                        onClick={i => this.handleClick(i)}
                        guessHigher={i => this.guessHigher(i)}
                        guessLower={i => this.guessLower(i)}
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

// function calculateWinner(squares) {
//     const lines = [
//         [0, 1, 2],
//         [3, 4, 5],
//         [6, 7, 8],
//         [0, 3, 6],
//         [1, 4, 7],
//         [2, 5, 8],
//         [0, 4, 8],
//         [2, 4, 6]
//     ];
//     for (let i = 0; i < lines.length; i++) {
//         const [a, b, c] = lines[i];
//         if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//             return squares[a];
//         }
//     }
//     return null;
// }
