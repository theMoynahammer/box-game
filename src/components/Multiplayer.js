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
        const { cardsRemaining, initialBoard } = getInitialBoardAndCardsRemaining();
        const initialState = getInitialState(cardsRemaining, initialBoard);
        window.addEventListener('beforeunload', this.componentCleanup);
        this.state = {
            gameState: [initialState],
            // gameState: [null],
            modalToShow: null,
            playerName: null,
            selectedBackground: localStorage.getItem('backgroundPreference') || 'amEx',
        }
    }

    componentDidMount() {
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
            })
        });
    }
// TODO how to remove olayer from session when they quit.
    // componentCleanup(){
    //     alert('ok')
    //     const currentState = this.state.gameState[this.state.gameState.length - 1];
    //     const indexOfPlayer = currentState.playersInSession.indexOf((item)=>item.sessionId === this.state.sessionId);
    //     const stateWithPlayerRemoved = currentState.splice(indexOfPlayer, 1);
    //     this.emitToSocket(stateWithPlayerRemoved);
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
        newState.playersWhoGuessedLast = [...currentState.playersWhoGuessedLast ? currentState.playersWhoGuessedLast : [], { playerName: this.state.playerName, guessWasCorrect: newState.guessWasCorrect.toString() }]
        this.formattedCardsRemainingList = formatRemainingCardsCount(newState.cardsRemaining)
        this.emitToSocket(newState)
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
        initialState.playersInSession = this.state.gameState[this.state.gameState.length - 1].playersInSession;
        this.emitToSocket(initialState)
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    savePlayerInfo = () => {
        if (this.state.playerName) {
            // if (!this.state.sessionId) {
                this.setState((prevState)=> ({ sessionId: prevState.sessionId || uuidv4() }) , () => {
                    this.toggleModal('playerInfo', false)
                    const currentState = this.state.gameState[this.state.gameState.length - 1];
                    const playerInfoObject = {
                        playerName: this.state.playerName,
                        sessionId: this.state.sessionId,
                    }
                    if (currentState.playersInSession) {
                        // const isPlayerInArray = currentState.playersInSession.some((item) => {
                        //     return item.sessionId === this.state.sessionId;
                        // })
                        const indexOfPlayerInArray = currentState.playersInSession.findIndex((item) => item.sessionId === this.state.sessionId);
                        if (indexOfPlayerInArray < 0) {
                            currentState.playersInSession.push(playerInfoObject)
                        }else{
                            currentState.playersInSession[indexOfPlayerInArray] = playerInfoObject;
                        }

                    } else {
                        currentState.playersInSession = [playerInfoObject];
                    }
                    this.emitToSocket(currentState)
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
                {this.state.sessionId && <div id="main-container">
                    <div id="info-pane">
                        <GuessHistory currentState={this.state.gameState[this.state.gameState.length - 1]} />
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
