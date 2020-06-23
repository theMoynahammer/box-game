import React from 'react';
import ReactDOM from 'react-dom';
// import ImageMapper from 'react-image-mapper';
// import cloneDeep from 'lodash/cloneDeep';
import { evaluateGuess, formatRemainingCardsCount } from './logic-functions/helperFunctions';
import { getInitialBoardAndCardsRemaining, getInitialState } from './logic-functions/setUpInitialBoard';
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
        <div style={{ height: 'auto', maxWidth: '14.5vw', minHeight: '15vh', position: 'relative' }}>
            {/* <div className="square"> */}
            {/* <img src={props.imgPath} alt="nothing loaded :("></img> */}
            {props.spotIsStillValid ? <div onClick={props.guessHigher} className="higher-button"></div> : null}
            <ResponsiveEmbed aspectRatio="1by1">
                {/* <embed type="image/svg" src={props.imgPath} /> */}
                <Image style={{ objectFit: 'contain', ...(props.imgPath.includes('cardback') ? { borderRadius: '26%' } : {}) }} src={props.imgPath} alt="nothing loaded :(" ></Image>
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
            <div style={{ backgroundSize: 'cover', backgroundImage: `url(${process.env.PUBLIC_URL}/woodimage.jpg)`, padding: '10px 0px' }}>
                {/* <div className="board-row"> */}
                <Row className="refactored-row">
                    {/* TODO use card-box class and center everything */}
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
            <Container fluid='md' style={{ backgroundColor: 'white', padding: '0px' }}>
                <Navbar bg="dark" variant="dark" expand="lg">
                    {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
                    <img
                        src={process.env.PUBLIC_URL + "/boximage.png"}
                        width="30"
                        height="30"
                        alt="The Box Game"
                    />
                    <Navbar.Brand style={{ paddingLeft: '5px' }}>The Box Game</Navbar.Brand>
                    {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
                    {/* <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </Navbar.Collapse> */}
                </Navbar>
                {/* <div class="box-game-header"><Image style={{ width: '30px' }} src={process.env.PUBLIC_URL + "/boximage.png"}></Image>{`The Box Game`}</div> */}
                <Row >
                    <Col xs={4} className="infoDiv">
                        {/* <div className="infoDiv"> */}
                        <div className="stat-line"><strong>Cards remaining: </strong>{this.state.gameState[this.state.gameState.length - 1].cardsRemaining.length}</div>
                        <div className="stat-line"><strong>Previous guess: </strong>{this.previousGuess}</div>
                        <div className="stat-line"><strong>Card drawn: </strong>{this.cardDrawn}</div>
                        <div className="stat-line"><strong>Previous card: </strong>{this.previousCard}</div>
                        <div className="stat-line"><strong>Number of samesies: </strong>{this.numberOfSamesies}</div>
                        {/* <label> */}
                            {/* <strong>Would you like to cheat?</strong> */}
                            {/* <input
                                name="isThePlayerACheater"
                                type="checkbox"
                                checked={this.state.isThePlayerACheater}
                                onChange={this.handleCheatingCheckbox} /> */}
                            <Form>
                                <Form.Check
                                    // style={{
                                    //     backgroundColor: '#343a40',
                                    //     borderColor: "#343a40"
                                    // }}
                                    inline
                                    name="isThePlayerACheater"
                                    type="checkbox"
                                    id="custom-switch"
                                    checked={this.state.isThePlayerACheater}
                                    onChange={this.handleCheatingCheckbox}
                                    label="Would you like to cheat?"
                                />
                            </Form>
                        {/* </label> */}
                        {/* {this.state.gameState[this.state.gameState.length - 1].gameLost === true ? <h1 style={{ color: "red" }}>You Lose, Idiot!</h1> : null} */}
                        {this.state.gameState[this.state.gameState.length - 1].gameWon === true ? <h4>You Win! You're a genius!</h4> : null}
                        {this.state.isThePlayerACheater ? this.formattedCardsRemainingList.map((card) => <div>{card}</div>) : null}

                        {/* </div> */}
                        {/* <div className="game"> */}
                        {/* <div className="game-board"> */}
                    </Col>
                    <Col>
                        {this.state.gameState[this.state.gameState.length - 1].gameLost === true && 
                            <div className="you-lose-overlay">
                                <div className="you-lose-modal">
                                    <h1>You Lose!</h1>
                                    <Button onClick={() => window.location.reload()} variant="secondary">Play Again?</Button>
                                </div>
                            </div>
                        }
                            <Board
                                squares={this.state.gameState[this.state.gameState.length - 1].currentBoard}
                                evaluateGuess={(i, higherLowerOrSamesies) => this.handleGuessAndManageState(i, higherLowerOrSamesies)}
                            />
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
