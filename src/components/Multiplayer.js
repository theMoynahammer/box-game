import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';
import { evaluateGuess, formatRemainingCardsCount } from '../logic-functions/helperFunctions';
import { getInitialBoardAndCardsRemaining, getInitialState } from '../logic-functions/setUpInitialBoard';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
// import FormControl from 'react-bootstrap/FormControl';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaQuestion, FaStickyNote } from 'react-icons/fa';
// import { FcCheckmark, FcCancel } from 'react-icons/fc';
import { Board } from './Board';
import CurrentGameInfo from './CurrentGameInfo';
import Modals from './Modals';
import GuessHistory from './GuessHistory';
import PlayersInGame from './PlayersInGame';
// related to socket testing
import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:8080/multiplayer1";
// const ENDPOINT = "http://127.0.0.1:8080";
const ENDPOINT = "https://morning-shore-03481.herokuapp.com"
// const GAME_NUMBER = 1;

class Game extends React.Component {
    constructor(props) {
        super(props);
        const { cardsRemaining, initialBoard } = getInitialBoardAndCardsRemaining();
        const initialState = getInitialState(cardsRemaining, initialBoard);
        const rageQuits = parseInt(localStorage.getItem('rageQuits')) || 0;
        const totalWins = parseInt(localStorage.getItem('totalWins')) || 0;
        const totalLosses = parseInt(localStorage.getItem('totalLosses')) || 0;
        this.state = {
            gameState: [initialState],
            isThePlayerACheater: false,
            modalToShow: null,
            rageQuits,
            totalWins,
            totalLosses,
            showCardsRemainingUnlocked: totalWins >= 1 ? true : false,
            playerName: localStorage.getItem('playerName') || null,
            selectedBackground: localStorage.getItem('backgroundPreference') || 'amEx',
        }
    }

    previousCard = null;
    // previousGuess = null;
    cardDrawn = null;
    numberOfSamesies = 0;
    formattedCardsRemainingList = null;
    currentStreakNumber = null;
    currentStreakType = null;
    // rageQuits = localStorage.getItem('rageQuits') || 0;
    // totalWins = localStorage.getItem('totalWins') || 0;
    // totalLosses = localStorage.getItem('totalLosses') || 0;
    previousOutcome = null;
    // playerName = null;

    componentDidMount() {
        this.connectToSocket();
        if (!this.state.playerName) {
            this.toggleModal('playerInfo', true)
        }
    }

    connectToSocket = () => {
        this.socket = socketIOClient(ENDPOINT);
        this.socket.emit(`joining game ${this.props.gameNumber}`);
        this.socket.on(`joiningGameState${this.props.gameNumber}`, response => {
            if (!response) { this.emitToSocket(this.state.gameState[this.state.gameState.length - 1]) }
            else {
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

    componentWillUnmount() {

    }

    emitToSocket = (newState) => {
        console.log(newState)
        // console.log('oo')
        // this.socket = socketIOClient(ENDPOINT);
        this.socket.emit(`newState${this.props.gameNumber}`, newState);
    }

    handleGuessAndManageState(i, higherLowerOrSamesies) {
        const currentState = { ...this.state.gameState[this.state.gameState.length - 1] };
        const { newState } = evaluateGuess(i, higherLowerOrSamesies, currentState);
        const { cardDrawn, previousCard, numberOfSamesies, gameLost, gameWon } = newState;
        if (gameLost) this.handleWinLossStats(false);
        if (gameWon) this.handleWinLossStats(true);
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

    resetGame = (rageQuit = false) => {
        if (rageQuit) {
            // this.rageQuits++;
            this.setState(prevState => ({ rageQuits: prevState.rageQuits + 1 }), () => {
                localStorage.setItem('rageQuits', this.state.rageQuits);
                // this.totalLosses++;
                this.handleWinLossStats(false);
            });
        };
        // this.previousGuess = null;
        const { cardsRemaining, initialBoard } = getInitialBoardAndCardsRemaining();
        const initialState = getInitialState(cardsRemaining, initialBoard);
        this.emitToSocket(initialState)
        // this.setState({ gameState: [initialState] });
    }

    clearStats = () => {
        localStorage.removeItem('totalLosses');
        localStorage.removeItem('totalWins');
        localStorage.removeItem('rageQuits');
        this.currentStreakNumber = null;
        this.setState({
            totalLosses: 0,
            totalWins: 0,
            rageQuits: 0,
            showCardsRemainingUnlocked: false,
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    setBackground = (selectedBackground) => {
        localStorage.setItem('backgroundPreference', selectedBackground);
        this.setState({ selectedBackground })
    }

    savePlayerInfo = () => {
        if (this.state.playerName) {
            localStorage.setItem('playerName', this.state.playerName)
            this.toggleModal('playerInfo', false)
        }
        localStorage.setItem('backgroundPreference', this.state.selectedBackground)
    }

    handleWinLossStats = (gameWon) => {
        if (!gameWon) {
            if (this.currentStreakType === 'losses') {
                this.currentStreakNumber++;
            }
            else if (this.currentStreakType === 'wins' || this.currentStreakType === null) {
                this.currentStreakNumber = 1;
            }
            this.currentStreakType = 'losses'
            // this.totalLosses++;
            this.setState(prevState => ({ totalLosses: prevState.totalLosses + 1 }), () => {
                localStorage.setItem('totalLosses', this.state.totalLosses)
            });
        }
        else {
            if (this.currentStreakType === 'wins') {
                this.currentStreakNumber++;
            }
            else if (this.currentStreakType === 'losses' || this.currentStreakType === null) {
                this.currentStreakNumber = 1;
            }
            // this.totalWins++;
            this.currentStreakType = 'wins'
            this.setState(prevState => (
                { totalWins: prevState.totalWins + 1 }), () => {
                    localStorage.setItem('totalWins', this.state.totalWins)
                    this.handleUnlocks();
                });
        }
    }

    handleUnlocks = () => {
        this.setState({
            ...(this.state.totalWins === 1 && { showCardsRemainingUnlocked: true })
        })
    }

    handleCheatingCheckbox = (event) => {
        this.formattedCardsRemainingList = event.target.checked ? formatRemainingCardsCount(this.state.gameState[this.state.gameState.length - 1].cardsRemaining) : null;
        this.setState({ isThePlayerACheater: event.target.checked })
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
                        <Nav className="mr-auto">
                            {/* <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link> */}
                            {/* <Button variant="outline-danger" onClick={() => this.resetGame(true)}>Rage Quit</Button> */}
                        </Nav>
                        {/* <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-success">Search</Button>
                        </Form> */}
                        <div onClick={() => { this.toggleModal('playerInfo', true) }} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'white', paddingRight: '16px' }}>
                            {this.state.playerName}
                        </div>

                        <FaStickyNote onClick={() => this.toggleModal('notes', true)} style={{ marginRight: '16px', width: '20px', height: '20px', cursor: 'pointer', color: 'white' }}></FaStickyNote>
                        <FaQuestion onClick={() => this.toggleModal('help', true)} style={{ width: '20px', height: '20px', cursor: 'pointer', color: 'white' }} />
                    </Navbar.Collapse>
                </Navbar>
                <Container fluid id="main-container"style={{ backgroundColor: 'white', paddingRight: '-15px', paddingLeft: '-15px' }}>

                    <Modals
                        modalToShow={this.state.modalToShow}
                        toggleModal={(modal, showModal) => this.toggleModal(modal, showModal)}
                        savePlayerInfo={() => this.savePlayerInfo()}
                        handleChange={(e) => this.handleChange(e)}
                        selectedBackground={this.state.selectedBackground}
                        playerName={this.state.playerName}
                    />
                    <Row className="main-row">
                        <Col xs={12} sm={4} >
                            <Row>
                                <Col xs={4} sm={12}>
                                    <CurrentGameInfo
                                        currentState={this.state.gameState[this.state.gameState.length - 1]}
                                        // previousGuess={this.previousGuess}
                                        resetGame={(rageQuit) => this.resetGame(rageQuit)}
                                    />
                                </Col>
                                {/* <hr className="custom-hr" /> */}
                                <Col xs={4} sm={12}>
                                    <GuessHistory currentState={this.state.gameState[this.state.gameState.length - 1]} />
                                    {/* <div className="stats-header">Stats</div>
                        <div className="stat-line">Total Wins: {this.state.totalWins}</div>
                        <div className="stat-line">Total Losses: {this.state.totalLosses}</div>
                        <div className="stat-line">Winning Percentage: {this.state.totalWins + this.state.totalLosses !== 0 ? Number(this.state.totalWins / (this.state.totalWins + this.state.totalLosses)).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 }) : 'N/A'}</div>
                        <div className="stat-line">Current Streak: {this.currentStreakNumber ? `${this.currentStreakNumber} ${this.currentStreakType} in a row` : 'N/A'}</div>
                        <div className="stat-line">Rage Quits: {this.state.rageQuits}</div>
                        <Button className="info-div-buttons" variant="outline-warning" size="sm" onClick={() => this.toggleModal('showStatResetModal')}>Reset Stats</Button> */}
                                </Col>
                                <Col xs={4} sm={12}>
                                    <PlayersInGame currentState={this.state.gameState[this.state.gameState.length - 1]} />
                                </Col>
                                {/* <hr className="custom-hr" /> */}
                            </Row>
                        </Col>
                        <Col xs={12} sm={8}
                            className="col-override game-board"
                        >
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
                                        {this.state.totalWins === 1 && <h6>Congrats! You can now show remaining card counts<br /> by using the checkbox in the Unlockables section   </h6>}
                                        <Button onClick={() => this.resetGame()} variant="secondary">Play Again?</Button>
                                    </div>
                                </div>
                            }
                            <Board
                                squares={this.state.gameState[this.state.gameState.length - 1].currentBoard}
                                evaluateGuess={(i, higherLowerOrSamesies) => this.handleGuessAndManageState(i, higherLowerOrSamesies)}
                                selectedBackground={this.state.selectedBackground}
                            />
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

Game.propTypes = {
    gameNumber: PropTypes.number.isRequired,
}

export default Game;
