import React from 'react';
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
import { Board } from './Board';

class Game extends React.Component {
    constructor(props) {
        super(props);
        const { cardsRemaining, initialBoard } = getInitialBoardAndCardsRemaining();
        const initialState = getInitialState(cardsRemaining, initialBoard);
        this.state = {
            gameState: [initialState],
            isThePlayerACheater: false,
            selectedBackground: localStorage.getItem('backgroundPreference') || 'amEx',
            showHelpModal: false,
            showNotesModal: false,
            showStatResetModal: false,
            rageQuits: parseInt(localStorage.getItem('rageQuits')) || 0,
            totalWins: parseInt(localStorage.getItem('totalWins')) || 0,
            totalLosses: parseInt(localStorage.getItem('totalLosses')) || 0,
            showCardsRemainingUnlocked: false,
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

    handleGuessAndManageState(i, higherLowerOrSamesies) {
        const currentState = { ...this.state.gameState[this.state.gameState.length - 1] };
        const { newState } = evaluateGuess(i, higherLowerOrSamesies, currentState);
        const { cardDrawn, previousCard, numberOfSamesies, previousGuess, gameLost, gameWon } = newState;
        if (gameLost) this.handleWinLossStats(false);
        if (gameWon) this.handleWinLossStats(true);
        this.cardDrawn = cardDrawn;
        this.previousCard = previousCard;
        this.numberOfSamesies = numberOfSamesies;
        this.previousGuess = previousGuess;
        this.formattedCardsRemainingList = formatRemainingCardsCount(newState.cardsRemaining)
        this.setState({
            gameState: [...this.state.gameState, newState]
        });
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
        const { cardsRemaining, initialBoard } = getInitialBoardAndCardsRemaining();
        const initialState = getInitialState(cardsRemaining, initialBoard);
        this.setState({ gameState: [initialState] });
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
        console.log(this.state.totalWins ===1)
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
            // <React.Fragment>
            <Container fluid='lg' className="container-override">
                {/* <Container fluid='lg' style={{ backgroundColor: 'white', padding: '0px' }}> */}
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
                            <li>✅Save background choice</li>
                            <li>Allow profile to be created</li>
                            <li>Create API backend to manage accounts</li>
                            <li>Make mad, mad cash</li>
                            <li>Add undo functionality</li>
                            <li>Write How to play section</li>
                            <li>Add deck of cards animation</li>
                            <li>Add samesies</li>
                            <li>Enhance Unlockables</li>
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
                    <Modal.Body>To </Modal.Body>
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
                        {/* <div className="infoDiv"> */}
                        <h5>Current Game Info</h5>
                        <div className="stat-line">Cards remaining: {this.state.gameState[this.state.gameState.length - 1].cardsRemaining.length}</div>
                        <div className="stat-line">Previous guess: {this.previousGuess}</div>
                        <div className="stat-line">Card drawn: {this.cardDrawn}</div>
                        <div className="stat-line">Previous card: {this.previousCard}</div>
                        <div className="stat-line">Number of samesies: {this.numberOfSamesies}</div>
                        <Button variant="outline-danger" size="sm" onClick={() => this.resetGame(true)}>Rage Quit</Button>
                        <hr />
                        <h5>Stats</h5>
                        <div className="stat-line">Total Wins: {this.state.totalWins}</div>
                        <div className="stat-line">Total Losses: {this.state.totalLosses}</div>
                        {/* <div className="stat-line">Winning Percentage: {this.state.totalWins+this.state.totalLosses !== 0 ? parseFloat((this.state.totalWins/(this.state.totalWins+this.state.totalLosses))).toFixed(2)+"%" : 'N/A'}</div> */}
                        {/* var s = Number(num/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});  */}

                        <div className="stat-line">Winning Percentage: {this.state.totalWins + this.state.totalLosses !== 0 ? Number(this.state.totalWins / (this.state.totalWins + this.state.totalLosses)).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 }) : 'N/A'}</div>
                        <div className="stat-line">Current Streak: {this.currentStreakNumber ? `${this.currentStreakNumber} ${this.currentStreakType} in a row` : 'N/A'}</div>
                        <div className="stat-line">Rage Quits: {this.state.rageQuits}</div>
                        <Button variant="outline-warning" size="sm" onClick={() => this.toggleModal('showStatResetModal')}>Reset Stats</Button>
                        <hr />
                        <h5>Unlockables</h5>
                        {/* <table class="table">
  <thead>
    <tr>
      <th scope="col">Wins Needed</th>
      <th scope="col">Ability</th>
      <th scope="col">Activate?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Show Remaining Card Counts</td>
      <td>Otto</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
    </tr>
  </tbody>
</table> */}
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
                                <span className="d-inline-block">
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
                                </span>
                            </OverlayTrigger>}
                        {/* <Form>
                            <Form.Check
                                disabled={true}
                                inline
                                name="isThePlayerACheater"
                                type="checkbox"
                                id="custom-switch"
                                checked={this.state.isThePlayerACheater}
                                onChange={this.handleCheatingCheckbox}
                                label="Show remaining card counts"
                            />
                        </Form> */}
                        {/* {this.state.gameState[this.state.gameState.length - 1].gameWon === true ? <h4>You Win! You're a genius!</h4> : null} */}
                        {this.state.isThePlayerACheater && this.formattedCardsRemainingList.map((card) => <div>{card}</div>)}
                    </Col>
                    <Col xs={12} sm={8}>
                        {this.state.gameState[this.state.gameState.length - 1].gameLost === true &&
                            <div className="you-lose-overlay">
                                <div className="you-lose-modal">
                                    <h1>You Lose, BOO!</h1>
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
        );
    }
}

export { Game };
