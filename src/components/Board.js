import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Square } from './Square';

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

    backgroundImageNames = {
        earth: 'earth.jpg',
        mars: 'mars.jpg',
        amEx: 'amEx.png',
        darkPattern: 'darkPattern.jpg',
        moon: 'moon.jpg',
        underwater: 'underwater.jpg',
        wood: 'woodimage.jpg'
    }

    render() {
        return (
            <div style={{ 
                backgroundSize: 'cover',
                // backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${process.env.PUBLIC_URL}/${this.backgroundImageNames[this.props.selectedBackground]})`,
                padding: '10px 0px' }}>
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
            </div>
        );
    }
}

export { Board };
