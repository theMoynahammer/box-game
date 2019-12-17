import React from 'react';
import ReactDOM from 'react-dom';
import ImageMapper from 'react-image-mapper';
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
                onClick={()=> console.log(props)}
                alt="nothing loaded :("></img>
            <button onClick={props.guessHigher}
                className="top-button">Higher</button>
            <button onClick={props.guessLower}
                className="bottom-button">Lower</button>
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
            gameState : [],
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


    // jumpTo(step) {
    //     this.setState({
    //         stepNumber: step,
    //         xIsNext: (step % 2) === 0
    //     });
    // }

    getRandomCardIndex (lengthOfCardsRemainingArray) {
        return Math.floor(Math.random() * lengthOfCardsRemainingArray);
    }

    async guessHigher (i) {
        console.log(this.state.gameState)
        const currentState = this.state.gameState[this.state.gameState.length-1];
        const newState = {...currentState};
        // console.log(currentState)
        const currentCard = currentState.currentBoard[i];
        // console.log(currentCard)
        const currentCardStrength = currentCard.strength;
        const stateFormat = {...this.stateFormat};
        const newRandomCardIndex = this.getRandomCardIndex(currentState.cardsRemaining.length);
        const chosenCardDetails = currentState.cardsRemaining[newRandomCardIndex];
        newState.cardsRemaining.splice(newRandomCardIndex, 1);
        newState.turnNumber ++;
        newState.currentBoard[i] = chosenCardDetails;
        newState.cardsRemovedFromDeck.push(chosenCardDetails);
        // this.state.gameState.push(newState);
        console.log(currentState)
        console.log(this.state.gameState)
        const fake = [...this.state.gameState, newState];
        console.log(fake)
        // console.log(newState)
        await this.setState({
            gameState: [...this.state.gameState, newState]
        });

        console.log(this.state.gameState)
        // console.log(this.state.gameState)
        // const cardsRemaining = 
        // const indexOfChosenCard = this.getRandomCardIndex(cardsRemaining.length);
        // const chosenCardDetails = cardsRemaining[indexOfChosenCard];
        // cardsRemaining.splice(indexOfChosenCard, 1);
        // console.log(this.state.gameState)
// alert(JSON.stringify(this.currentBoard[i]));
    }

    guessLower(i){
        alert(JSON.stringify(this.currentBoard[i]));
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

        const { cardsRemaining, initialBoard } = getInitialBoardAndCardsRemaining();
        // this.currentBoard = initialBoard;
        saveInitialState(cardsRemaining, initialBoard);
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        // squares={current.squares}
                        squares={this.state.gameState[this.state.gameState.length-1].currentBoard}
                        onClick={i => this.handleClick(i)}
                        guessHigher={i=>this.guessHigher(i)}
                        guessLower={i=>this.guessLower(i)}
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
