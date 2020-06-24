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
import Button from 'react-bootstrap/Button';
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed';
import { Board } from './Board';

class Game extends React.Component {
    constructor(props) {
        super(props);
        const { cardsRemaining, initialBoard } = getInitialBoardAndCardsRemaining();
        const initialState = getInitialState(cardsRemaining, initialBoard);
        this.state = {
            gameState: [initialState],
            isThePlayerACheater: false,
            selectedBackground: 'wood',
        }
    }

    previousCard = null;
    previousGuess = null;
    cardDrawn = null;
    numberOfSamesies = 0;
    formattedCardsRemainingList = null;
    currentStreakNumber = 'N/A';
    currentStreakType = null;
    rageQuits = 0;
    totalWins = 0;
    totalLosses = 0;
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

    resetGame = (rageQuit = false) => {
        if (rageQuit) {
            this.rageQuits++;
            // this.totalLosses++;
            this.handleWinLossStats(false);
        };
        const { cardsRemaining, initialBoard } = getInitialBoardAndCardsRemaining();
        const initialState = getInitialState(cardsRemaining, initialBoard);
        this.setState({ gameState: [initialState] });
    }

    setBackground = (selectedBackground) => {
        this.setState({ selectedBackground })
    }

    handleWinLossStats = (gameWon) =>{
        if (!gameWon) {
            if (this.currentStreakType === 'losses') {
                this.currentStreakNumber ++;
            }
            else if (this.currentStreakType === 'wins' || this.currentStreakType === null){
                this.currentStreakNumber = 1;
            }
            this.totalLosses++;
            this.currentStreakType = 'losses'
        }
        else {
            if (this.currentStreakType === 'wins') {
                this.currentStreakNumber ++;
            }
            else if (this.currentStreakType === 'losses' || this.currentStreakType === null){
                this.currentStreakNumber = 1;
            }
            this.totalWins++;
            this.currentStreakType = 'wins'
        }
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
                            <NavDropdown title="Background" >
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
                            <Button variant="outline-danger" onClick={() => this.resetGame(true)}>Rage Quit</Button>
                        </Nav>
                        {/* <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-success">Search</Button>
                        </Form> */}
                    </Navbar.Collapse>
                </Navbar>
                <Row className="main-row">
                    <Col xs={12} sm={4} className="infoDiv">
                        {/* <div className="infoDiv"> */}
                        <h5>Current Game Info</h5>
                        <div className="stat-line">Cards remaining: {this.state.gameState[this.state.gameState.length - 1].cardsRemaining.length}</div>
                        <div className="stat-line">Previous guess: {this.previousGuess}</div>
                        <div className="stat-line">Card drawn: {this.cardDrawn}</div>
                        <div className="stat-line">Previous card: {this.previousCard}</div>
                        <div className="stat-line">Number of samesies: {this.numberOfSamesies}</div>
                        <hr />
                        <h5>Session Stats</h5>
                        <div className="stat-line">Total Wins: {this.totalWins}</div>
                        <div className="stat-line">Total Losses: {this.totalLosses}</div>
                        <div className="stat-line">Current Streak: {`${this.currentStreakNumber} ${this.currentStreakType} in a row`}</div>
                        <div className="stat-line">Rage Quits: {this.rageQuits}</div>
                        <hr />
                        <Form>
                            <Form.Check
                                inline
                                name="isThePlayerACheater"
                                type="checkbox"
                                id="custom-switch"
                                checked={this.state.isThePlayerACheater}
                                onChange={this.handleCheatingCheckbox}
                                label="Would you like to cheat?"
                            />
                        </Form>
                        {/* {this.state.gameState[this.state.gameState.length - 1].gameWon === true ? <h4>You Win! You're a genius!</h4> : null} */}
                        {this.state.isThePlayerACheater && this.formattedCardsRemainingList.map((card) => <div>{card}</div>)}
                    </Col>
                    <Col xs={12} sm={8}>
                        {this.state.gameState[this.state.gameState.length - 1].gameLost === true &&
                            <div className="you-lose-overlay">
                                <div className="you-lose-modal">
                                    <h1>You Lose!</h1>
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
                    </Col>
                </Row>
            </Container>
        );
    }
}

export { Game };
