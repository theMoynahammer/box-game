import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';

const CurrentGameInfo = ({currentState, previousGuess, resetGame}) => {
    const cardsRemainingIcons = currentState.cardsRemaining.map(() =>
        <img className="cards-remaining-card" src={process.env.PUBLIC_URL + `/cardback.jpg`} alt="not found :("></img>
    );


    return (
        <div id="current-game-info">
            <div className="card-remaining-icon-div">{cardsRemainingIcons}</div>
            {/* {previousGuess && <table class="table table-override-cards">
                <tbody>
                    <tr className="guess-tr">
                        <td className="guess-td guess-td-top">Previous</td>
                        <td className="guess-td guess-td-top">Guess</td>
                        <td className="guess-td guess-td-top">Drawn</td>
                    </tr>
                    <tr className="guess-tr">
                        <td className="guess-td"><img className="card-images-guess" src={currentState.previousCardImageUrl} /></td>
                        <td className="guess-td" style={{ ...(!currentState.guessWasCorrect && { color: 'red' }) }}>{previousGuess === 'lower' ? <GoArrowDown className="guess-icon" /> : <GoArrowUp className="guess-icon" />}</td>
                        <td className="guess-td"><img className="card-images-guess" src={currentState.currentCardImageUrl} /></td>
                    </tr>
                </tbody>
            </table>} */}
            <Button className="info-div-buttons" variant="outline-danger" size="sm" onClick={()=>resetGame(true)}>Rage Quit</Button>
        </div>
    );
}

export default CurrentGameInfo;
