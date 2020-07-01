import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { evaluateGuess, formatRemainingCardsCount } from '../logic-functions/helperFunctions';
import { getInitialBoardAndCardsRemaining, getInitialState } from '../logic-functions/setUpInitialBoard';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaQuestion, FaStickyNote } from 'react-icons/fa';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { Board } from './Board';
import CurrentGameInfo from './CurrentGameInfo';
// related to socket testing
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8080";

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
            selectedBackground: localStorage.getItem('backgroundPreference') || 'amEx',
            showHelpModal: false,
            showNotesModal: false,
            showStatResetModal: false,
            rageQuits,
            totalWins,
            totalLosses,
            showCardsRemainingUnlocked: totalWins >= 1 ? true : false,
        }
    }

    previousCard = null;
    previousGuess = null;
    cardDrawn = null;
    numberOfSamesies = 0;
    formattedCardsRemainingList = null;
    currentStreakNumber = null;
    currentStreakType = null;
    // rageQuits = localStorage.getItem('rageQuits') || 0;
    // totalWins = localStorage.getItem('totalWins') || 0;
    // totalLosses = localStorage.getItem('totalLosses') || 0;
    previousOutcome = null;

    // useEffect(() => {
    //     const socket = socketIOClient(ENDPOINT);
    //     socket.on("chat message", data => {
    //       setResponse(data);
    //     });
    //   }, []);

      componentDidMount() {
        this.connectToSocket();
      }
    //   componentDidUpdate() {
    //     this.connectToSocket();
    //   }  

    connectToSocket = () =>{
        console.log('connectToSocket')
        this.socket = socketIOClient(ENDPOINT);
        this.socket.emit("joining game");
        this.socket.on("joiningGameState", response =>{
            console.log('this is the response', response)
            if (!response) {this.emitToSocket(this.state.gameState[this.state.gameState.length - 1])}
            else {
                this.setState({
                    gameState: [...this.state.gameState, response],
                  })
            }
        })
        this.socket.on("newState", newState => {
            console.log('getting new state', newState)
          this.setState({
            gameState: [...this.state.gameState, newState],
          })
        });
    }

    emitToSocket = (newState) =>{
        // console.log('oo')
        // this.socket = socketIOClient(ENDPOINT);
        this.socket.emit('newState', newState);
    }

    handleGuessAndManageState(i, higherLowerOrSamesies) {
        const currentState = { ...this.state.gameState[this.state.gameState.length - 1] };
        const { newState } = evaluateGuess(i, higherLowerOrSamesies, currentState);
        const { cardDrawn, previousCard, numberOfSamesies, previousGuess, gameLost, gameWon, previousCardImageUrl, currentCardImageUrl } = newState;
        if (gameLost) this.handleWinLossStats(false);
        if (gameWon) this.handleWinLossStats(true);
        this.cardDrawn = cardDrawn;
        this.previousCard = previousCard;
        this.numberOfSamesies = numberOfSamesies;
        this.previousGuess = previousGuess;
        this.formattedCardsRemainingList = formatRemainingCardsCount(newState.cardsRemaining)
        this.emitToSocket(newState)
        // this.setState({
        //     gameState: [...this.state.gameState, newState]
        // });
    }

    toggleModal = (modalToChange) => {
        // Options are:
        // - showStatResetModal
        // - showNotesModal
        // - showHelpModal
        this.setState({
            [modalToChange]: !this.state[modalToChange],
        })
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
        this.previousGuess = null;
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

    setBackground = (selectedBackground) => {
        localStorage.setItem('backgroundPreference', selectedBackground);
        this.setState({ selectedBackground })
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
        console.log(this.state.totalWins === 1)
        this.setState({
            ...(this.state.totalWins === 1 && { showCardsRemainingUnlocked: true })
        })
    }

    handleCheatingCheckbox = (event) => {
        this.formattedCardsRemainingList = event.target.checked ? formatRemainingCardsCount(this.state.gameState[this.state.gameState.length - 1].cardsRemaining) : null;
        this.setState({ isThePlayerACheater: event.target.checked })
    }

    render() {
        const cardsRemainingIcons = this.state.gameState[this.state.gameState.length - 1].cardsRemaining.map(() =>
            <img className="cards-remaining-card" src={process.env.PUBLIC_URL + `/cardback.jpg`} alt="not found :("></img>
        );
        // const guessIcon = this.previousGuess === 'lower' ? <GoArrowDown className="guess-icon"/> : <GoArrowUp className="guess-icon"/>
        return (
            // <React.Fragment>
            // <Container fluid className="container-override">
            // <div>
            <Container fluid='lg' style={{ backgroundColor: 'white', padding: '0px' }}>
                <Navbar bg="dark" variant="dark">
                    {/* <Navbar bg="dark" variant="dark" expand="sm"> */}
                    {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
                    <img
                        src={process.env.PUBLIC_URL + "/boximage.png"}
                        width="30"
                        height="30"
                        alt="The Box Game"
                    />
                    <Navbar.Brand style={{ paddingLeft: '5px' }}>The Box Game</Navbar.Brand>
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
                        <Form inline>
                            <NavDropdown title="Background">
                                <NavDropdown.Item className="dropdown-item" onClick={() => this.setBackground('amEx')}>AmEx</NavDropdown.Item>
                                <NavDropdown.Item className="dropdown-item" onClick={() => this.setBackground('darkPattern')}>Dark Pattern</NavDropdown.Item>
                                <NavDropdown.Item className="dropdown-item" onClick={() => this.setBackground('earth')}>Earth</NavDropdown.Item>
                                <NavDropdown.Item className="dropdown-item" onClick={() => this.setBackground('mars')}>Mars</NavDropdown.Item>
                                <NavDropdown.Item className="dropdown-item" onClick={() => this.setBackground('moon')}>Moon</NavDropdown.Item>
                                <NavDropdown.Item className="dropdown-item" onClick={() => this.setBackground('underwater')}>Underwater</NavDropdown.Item>
                                <NavDropdown.Item className="dropdown-item" onClick={() => this.setBackground('wood')}>Wood</NavDropdown.Item>
                                {/* <NavDropdown.Item onClick={this.setBackground()}>Something</NavDropdown.Item> */}
                                {/* <NavDropdown.Divider /> */}
                                {/* <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> */}
                            </NavDropdown>
                        </Form>
                        <FaStickyNote onClick={() => this.toggleModal('showNotesModal')} style={{ marginRight: '16px', width: '20px', height: '20px', cursor: 'pointer', color: 'white' }}></FaStickyNote>
                        <FaQuestion onClick={() => this.toggleModal('showHelpModal')} style={{ width: '20px', height: '20px', cursor: 'pointer', color: 'white' }} />
                    </Navbar.Collapse>
                </Navbar>
                <Modal centered={true} show={this.state.showNotesModal} onHide={() => this.toggleModal('showNotesModal')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Connor's Future Enhancements</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Here are some enhancements I would like to make:
                            <ul>
                            <li>Remove margin from righthand side</li>
                            <li>✅ Save background choice</li>
                            <li>Allow profile to be created</li>
                            <li>Create API backend to manage accounts</li>
                            <li>Make mad, mad cash</li>
                            <li>Add undo functionality</li>
                            <li>Write How to play section</li>
                            <li>Add deck of cards animation</li>
                            <li>Add samesies</li>
                            <li>Enhance Unlockables</li>
                            <li>Prevent screen refreshing to avoid loss count</li>
                        </ul>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.toggleModal('showNotesModal')}>
                            Close
                        </Button>
                        {/* <Button variant="primary" onClick={this.toggleHelpModal}>
                            Save Changes
                        </Button> */}
                    </Modal.Footer>
                </Modal>
                <Modal centered={true} show={this.state.showHelpModal} onHide={() => this.toggleModal('showHelpModal')}>
                    <Modal.Header closeButton>
                        <Modal.Title>How to Play</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <strong>Intro: </strong>The Box Game started out as a drinking game at Virginia Tech, and now
                        it's being presented to you by Connor. <br/><br/>
                        <strong>Objective:</strong> Go through the 52 card deck before all 9 card piles are flipped over. On your turn,
                        choose Higher or Lower on one of the available piles by clicking the top half or bottom half of the card. If you are
                        correct, the pile remains available. If you are wrong, the pile is flipped over and is no longer available for selection.
                        <br/><br/>
                        <strong>Stats/Unlockables</strong> There are rewards for winning X number of games. Keep playing to see if you can unlock them all.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.toggleModal('showHelpModal')}>
                            Close
                        </Button>
                        {/* <Button variant="primary" onClick={this.toggleHelpModal}>
                            Save Changes
                        </Button> */}
                    </Modal.Footer>
                </Modal>
                <Modal centered={true} show={this.state.showStatResetModal} onHide={() => this.toggleModal('showStatResetModal')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Clicking Confirm will erase all of your stats and reset your progress towards unlockables.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.toggleModal('showStatResetModal')}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => { this.toggleModal('showStatResetModal'); this.clearStats() }}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Row className="main-row">
                    <Col xs={12} sm={4} className="infoDiv">
                    <CurrentGameInfo
                            currentState={this.state.gameState[this.state.gameState.length-1]}
                            previousGuess={this.previousGuess}
                            resetGame={(rageQuit)=>this.resetGame(rageQuit)}
                            />
                        <hr className="custom-hr" />
                        <div className="stats-header">Stats</div>
                        <div className="stat-line">Total Wins: {this.state.totalWins}</div>
                        <div className="stat-line">Total Losses: {this.state.totalLosses}</div>
                        {/* <div className="stat-line">Winning Percentage: {this.state.totalWins+this.state.totalLosses !== 0 ? parseFloat((this.state.totalWins/(this.state.totalWins+this.state.totalLosses))).toFixed(2)+"%" : 'N/A'}</div> */}
                        {/* var s = Number(num/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});  */}

                        <div className="stat-line">Winning Percentage: {this.state.totalWins + this.state.totalLosses !== 0 ? Number(this.state.totalWins / (this.state.totalWins + this.state.totalLosses)).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 }) : 'N/A'}</div>
                        <div className="stat-line">Current Streak: {this.currentStreakNumber ? `${this.currentStreakNumber} ${this.currentStreakType} in a row` : 'N/A'}</div>
                        <div className="stat-line">Rage Quits: {this.state.rageQuits}</div>
                        <Button className="info-div-buttons" variant="outline-warning" size="sm" onClick={() => this.toggleModal('showStatResetModal')}>Reset Stats</Button>
                        <hr className="custom-hr" />
                        <div className="stats-header">Unlockables</div>
                        {this.state.showCardsRemainingUnlocked ?
                            <Form.Check
                                // disabled={!this.state.showCardsRemainingUnlocked}
                                inline
                                name="isThePlayerACheater"
                                type="checkbox"
                                id="custom-switch"
                                checked={this.state.isThePlayerACheater}
                                onChange={this.handleCheatingCheckbox}
                                label="Show remaining card counts"
                            />
                            :
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">You must win one game to unlock this</Tooltip>}>
                                <div style={{ height: '30px', paddingTop: '10px' }} className="d-inline-block">
                                    {/* <Button disabled style={{ pointerEvents: 'none' }}>
                            Disabled button
                             </Button> */}
                                    <Form>
                                        <Form.Check
                                            disabled={!this.state.showCardsRemainingUnlocked}
                                            inline
                                            name="isThePlayerACheater"
                                            type="checkbox"
                                            id="custom-switch"
                                            checked={this.state.isThePlayerACheater}
                                            onChange={this.handleCheatingCheckbox}
                                            label="Show remaining card counts"
                                        />
                                    </Form>
                                </div>
                            </OverlayTrigger>}
                        {this.state.isThePlayerACheater && this.formattedCardsRemainingList.map((card) => <div>{card}</div>)}
                    </Col>
                    <Col xs={12} sm={8}
                        className="col-override"
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
                            // style={{    flex: '1 1 auto',
                            //     minWidth: '0'}}
                            squares={this.state.gameState[this.state.gameState.length - 1].currentBoard}
                            evaluateGuess={(i, higherLowerOrSamesies) => this.handleGuessAndManageState(i, higherLowerOrSamesies)}
                            selectedBackground={this.state.selectedBackground}
                        />
                    </Col>
                </Row>
            </Container>
            // </div>
        );
    }
}

export default Game;
