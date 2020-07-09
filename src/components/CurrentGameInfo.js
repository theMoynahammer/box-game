import React from "react";
import Button from 'react-bootstrap/Button';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { FaArrowLeft } from 'react-icons/fa'

const CurrentGameInfo = ({ currentState, resetGame }) => {
    const cardsRemainingIcons = currentState.cardsRemaining.map(() =>
        <img className="cards-remaining-card" src={process.env.PUBLIC_URL + `/cardback.jpg`} alt="not found :("></img>
    );

    return (
        <div id="current-game-info">
            <div className="card-remaining-icon-div">{cardsRemainingIcons}</div>
            {/* {currentState.playersWhoGuessedLast && <div id="previous-guess-info">
                <div id="players-guess">
                    {currentState.playersWhoGuessedLast[currentState.playersWhoGuessedLast.length - 1].playerName}'s guess
                </div>
                <table class="table table-override-cards">
                    <tbody>
                        <tr className="guess-tr">
                            <td className="guess-td guess-td-top">Previous</td>
                            <td className="guess-td guess-td-top">Guess</td>
                            <td className="guess-td guess-td-top">Drawn</td>
                        </tr>
                        <tr className="guess-tr">
                            <td className="guess-td"><img className="card-images-guess" src={currentState.previousCardImageUrl} /></td>
                            <td className="guess-td" style={{ ...(!currentState.guessWasCorrect && { color: 'red' }) }}>{currentState.previousGuess === 'lower' ? <GoArrowDown className="guess-icon" /> : <GoArrowUp className="guess-icon" />}</td>
                            <td className="guess-td"><img className="card-images-guess" src={currentState.currentCardImageUrl} /></td>
                        </tr>
                    </tbody>
                </table>

            </div>} */}
            <div style={{display:'flex', flexDirection: 'column'}}>
            <Button className="info-div-buttons-top" variant="outline-danger" size="sm" onClick={() => window.location.reload()}>Leave Session</Button>
            <Button className="info-div-buttons" variant="outline-danger" size="sm" onClick={() => resetGame(true)}>Remove Players</Button>
            </div>
        </div>
    );
}

export default CurrentGameInfo;
