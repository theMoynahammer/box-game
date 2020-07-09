import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import { Beforeunload } from 'react-beforeunload';
import { v4 as uuidv4 } from 'uuid';
import { evaluateGuess, formatRemainingCardsCount } from '../logic-functions/helperFunctions';
import { getInitialBoardAndCardsRemaining, getInitialState } from '../logic-functions/setUpInitialBoard';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { FaQuestion, FaStickyNote, FaTumblrSquare } from 'react-icons/fa';
import { Board } from './Board';
import CurrentGameInfo from './CurrentGameInfo';
import Modals from './Modals';
import GuessHistory from './GuessHistory';
import PlayersInGame from './PlayersInGame';
// related to socket testing
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://morning-shore-03481.herokuapp.com"

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.disconnectFromSession = this.disconnectFromSession.bind(this);
        const { cardsRemaining, initialBoard } = getInitialBoardAndCardsRemaining();
        const initialState = getInitialState(cardsRemaining, initialBoard);
        // window.addEventListener('beforeunload', this.componentCleanup);
        this.state = {
            gameState: [initialState],
            // gameState: [null],
            modalToShow: null,
            playerName: null,
            selectedBackground: localStorage.getItem('backgroundPreference') || 'amEx',
            isItPlayersTurn: false,
        }
    }

    componentDidMount() {
        window.onbeforeunload = function () {
            // this.onUnload();
            console.log("WE HERE")
            this.disconnectFromSession();
            // return "";
        }.bind(this)
        // window.addEventListener('beforeunload', this.componentCleanup);
        this.connectToSocket();
        if (!this.state.playerName) {
            this.toggleModal('playerInfo', true)
        }
    }

    connectToSocket = () => {
        this.socket = socketIOClient(ENDPOINT);
        this.socket.emit(`joining game ${this.props.gameNumber}`);
        this.socket.on(`joiningGameState${this.props.gameNumber}`, response => {
            if (!response) {
                this.emitToSocket(this.state.gameState[this.state.gameState.length - 1])
            } else {
                this.setState({
                    gameState: [...this.state.gameState, response],
                })
            }
        })
        this.socket.on(`newState${this.props.gameNumber}`, newState => {
            this.setState({
                gameState: [...this.state.gameState, newState],
                isItPlayersTurn: this.isItPlayersTurnFunction(newState),
            })
        });
    }

    isItPlayersTurnFunction = (stateToCompareWith) => {

        const playersInSession = stateToCompareWith.playersInSession;

        const indexOfActivePlayer = playersInSession.findIndex((person) => {
            return person.activePlayer === true;
        });

        console.log(JSON.stringify(playersInSession), indexOfActivePlayer)

        if (!stateToCompareWith.gameWon && !stateToCompareWith.gameLost && indexOfActivePlayer!== -1) {
            if (playersInSession[indexOfActivePlayer].sessionId === this.state.sessionId) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    disconnectFromSession() {
        const currentState = this.state.gameState[this.state.gameState.length - 1];
        const indexOfPlayer = currentState.playersInSession.findIndex((item) => {
            return item.sessionId === this.state.sessionId
        });
        if (currentState.playersInSession[indexOfPlayer].activePlayer === true) {
            if (indexOfPlayer === currentState.playersInSession.length - 1 && currentState.playersInSession.length !== 1) {
                currentState.playersInSession[0].activePlayer = true;
            } else if (currentState.playersInSession.length === 1) {
                currentState.playersInSession[indexOfPlayer].activePlayer = true;
            } else {
                currentState.playersInSession[indexOfPlayer + 1].activePlayer = true;
            }
        }
        currentState.playersInSession.splice(indexOfPlayer, 1);
        this.emitToSocket(currentState);
    }

    // componentWillUnmount(){
    //     console.log('here')
    // }

    // componentWillUnmount() {
    //     alert('here')
    //     // alert('ok')
    //     // const currentState = this.state.gameState[this.state.gameState.length - 1];
    //     // const indexOfPlayer = currentState.playersInSession.indexOf((item)=>item.sessionId === this.state.sessionId);
    //     // const stateWithPlayerRemoved = currentState.splice(indexOfPlayer, 1);
    //     // this.emitToSocket(stateWithPlayerRemoved);
    //     this.componentCleanup();
    //     window.removeEventListener('beforeunload', this.componentCleanup);
    // }

    emitToSocket = (newState) => {
        console.log(newState)
        this.socket.emit(`newState${this.props.gameNumber}`, newState);
    }

    handleGuessAndManageState(i, higherLowerOrSamesies) {
        const currentState = { ...this.state.gameState[this.state.gameState.length - 1] };
        const { newState } = evaluateGuess(i, higherLowerOrSamesies, currentState);
        const { cardDrawn, previousCard, numberOfSamesies } = newState;
        this.cardDrawn = cardDrawn;
        this.previousCard = previousCard;
        this.numberOfSamesies = numberOfSamesies;
        const indexOfActivePlayer = currentState.playersInSession.findIndex((person) => person.activePlayer === true);
        const lengthOfPlayersIndex = currentState.playersInSession.length;

        if (newState.guessWasCorrect) {
            newState.playersInSession[indexOfActivePlayer].correctGuesses++;
        }
        else {
            newState.playersInSession[indexOfActivePlayer].incorrectGuesses++;
        }

        if (indexOfActivePlayer === lengthOfPlayersIndex - 1) {
            // keep these two in this order please
            newState.playersInSession[indexOfActivePlayer].activePlayer = false;
            newState.playersInSession[0].activePlayer = true;
        } else {
            newState.playersInSession[indexOfActivePlayer].activePlayer = false;
            newState.playersInSession[indexOfActivePlayer + 1].activePlayer = true;
        }
        newState.playersWhoGuessedLast = [...currentState.playersWhoGuessedLast ? currentState.playersWhoGuessedLast : [], { playerName: this.state.playerName, guessWasCorrect: newState.guessWasCorrect.toString() }]
        this.formattedCardsRemainingList = formatRemainingCardsCount(newState.cardsRemaining)
        this.setState({
            isItPlayersTurn: this.isItPlayersTurnFunction(newState),
        }, () => {
            this.emitToSocket(newState)
        })

    }

    toggleModal = (modal, showModal) => {
        this.setState({
            modalToShow: showModal ? modal : null,
        });
    }

    resetGame = () => {
        // this.previousGuess = null;
        const { cardsRemaining, initialBoard } = getInitialBoardAndCardsRemaining();
        const initialState = getInitialState(cardsRemaining, initialBoard);
        // initialState.playersInSession = [];
        const oldPlayersInSessionWithStats = this.state.gameState[this.state.gameState.length - 1].playersInSession;
        const withoutStats = oldPlayersInSessionWithStats.map((person)=>{
            person.correctGuesses = 0;
            person.incorrectGuesses = 0;
            return person;
        })
        initialState.playersInSession = withoutStats;
        this.emitToSocket(initialState)
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    savePlayerInfo = () => {
        if (this.state.playerName) {
            // if (!this.state.sessionId) {
            this.setState((prevState) => ({ sessionId: prevState.sessionId || uuidv4() }), () => {
                this.toggleModal('playerInfo', false)
                const currentState = this.state.gameState[this.state.gameState.length - 1];
                const playerInfoObject = {
                    playerName: this.state.playerName,
                    sessionId: this.state.sessionId,
                    activePlayer: true,
                    incorrectGuesses: 0,
                    correctGuesses: 0,
                }
                if (currentState.playersInSession) {
                    // const isPlayerInArray = currentState.playersInSession.some((item) => {
                    //     return item.sessionId === this.state.sessionId;
                    // })
                    const indexOfPlayerInArray = currentState.playersInSession.findIndex((item) => item.sessionId === this.state.sessionId);
                    if (indexOfPlayerInArray < 0) {
                        const playerInfoObjectNotActive = { ...playerInfoObject };
                        playerInfoObjectNotActive.activePlayer = currentState.playersInSession.length === 0 ? true : false;
                        currentState.playersInSession.push(playerInfoObjectNotActive)
                    } else {
                        currentState.playersInSession[indexOfPlayerInArray] = playerInfoObject;
                    }

                } else {
                    currentState.playersInSession = [playerInfoObject];
                }

                this.setState({
                    isItPlayersTurn: this.isItPlayersTurnFunction(currentState),
                }, () => {
                    this.emitToSocket(currentState)
                })

                // this.emitToSocket(currentState)
                // this.setState({
                //     playerInfoReceived: true,
                // })
            })
            // }
            // this.toggleModal('playerInfo', false)
            // const currentState = this.state.gameState[this.state.gameState.length - 1];
            // if (!currentState.playersInSession.includes(this.state.playerName)) {
            //     currentState.playersInSession.push(this.state.playerName)
            // }
            // this.emitToSocket(currentState)
            // this.setState({
            //     playerInfoReceived: true,
            // })
        }
        localStorage.setItem('backgroundPreference', this.state.selectedBackground)
    }


    render() {
        return (
            <React.Fragment>
                <Navbar bg="dark" variant="dark">
                    {/* <Navbar bg="dark" variant="dark" expand="sm"> */}
                    {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
                    <img
                        src={process.env.PUBLIC_URL + "/boximage.png"}
                        width="30"
                        height="30"
                        alt="The Box Game"
                    />
                    {/* <Navbar.Brand style={{ paddingLeft: '5px' }}>The Box Game</Navbar.Brand> */}
                    <Form inline>
                        <NavDropdown title="The Box Game">
                            <NavDropdown.Item>
                                <Link className="dropdown-item" to="/">Single Player</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link className="dropdown-item" to="/multiplayer/1">Multiplayer Game #1</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link className="dropdown-item" to="/multiplayer/2">Multiplayer Game #2</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link className="dropdown-item" to="/multiplayer/3">Multiplayer Game #3</Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Form>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse>
                        <Nav className="mr-auto" />
                        <div onClick={() => { this.toggleModal('playerInfo', true) }} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'white', paddingRight: '16px' }}>
                            {this.state.playerName}
                        </div>

                        <FaStickyNote onClick={() => this.toggleModal('notes', true)} style={{ marginRight: '16px', width: '20px', height: '20px', cursor: 'pointer', color: 'white' }}></FaStickyNote>
                        <FaQuestion onClick={() => this.toggleModal('help', true)} style={{ width: '20px', height: '20px', cursor: 'pointer', color: 'white' }} />
                    </Navbar.Collapse>
                </Navbar>
                <Modals
                    modalToShow={this.state.modalToShow}
                    toggleModal={(modal, showModal) => this.toggleModal(modal, showModal)}
                    savePlayerInfo={() => this.savePlayerInfo()}
                    handleChange={(e) => this.handleChange(e)}
                    selectedBackground={this.state.selectedBackground}
                    playerName={this.state.playerName}
                    playerInfoReceived={this.state.playerInfoReceived}
                />
                {this.state.sessionId && <div style={{
                    ...((!this.state.isItPlayersTurn
                        && !this.state.gameState[this.state.gameState.length - 1].gameWon
                        && !this.state.gameState[this.state.gameState.length - 1].gameLost)
                        && { pointerEvents: 'none' })
                }} id="main-container">
                    <div id="info-pane">
                        {/* <GuessHistory currentState={this.state.gameState[this.state.gameState.length - 1]} /> */}
                        <CurrentGameInfo
                            currentState={this.state.gameState[this.state.gameState.length - 1]}
                            // previousGuess={this.previousGuess}
                            resetGame={(rageQuit) => this.resetGame(rageQuit)}
                        />
                        <PlayersInGame currentState={this.state.gameState[this.state.gameState.length - 1]} />
                    </div>
                    <div id="main-board">
                        {this.state.gameState[this.state.gameState.length - 1].gameLost === true &&
                            <div className="you-lose-overlay">
                                <div className="you-lose-modal">
                                    <h1>You Lose!</h1>
                                    <div className="game-summary">
                                        <table class="table table-override">
                                            <thead>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Cards Remaining</th>
                                                    <td>{this.state.gameState[this.state.gameState.length - 1].cardsRemaining.length}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Number of Samesies</th>
                                                    <td>{this.numberOfSamesies}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <Button onClick={() => this.resetGame()} variant="secondary">Play Again?</Button>
                                </div>
                            </div>
                        }
                        {this.state.gameState[this.state.gameState.length - 1].gameWon === true &&
                            <div className="you-win-overlay">
                                <div className="you-win-modal">
                                    <h1>You Win, YAY!</h1>
                                    <Button onClick={() => this.resetGame()} variant="secondary">Play Again?</Button>
                                </div>
                            </div>
                        }
                        <Board
                            squares={this.state.gameState[this.state.gameState.length - 1].currentBoard}
                            evaluateGuess={(i, higherLowerOrSamesies) => this.handleGuessAndManageState(i, higherLowerOrSamesies)}
                            selectedBackground={this.state.selectedBackground}
                        />
                    </div>
                </div>}
            </React.Fragment>
        );
    }
}

Game.propTypes = {
    gameNumber: PropTypes.number.isRequired,
}

export default Game;
