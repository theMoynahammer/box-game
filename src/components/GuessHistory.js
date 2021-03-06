import React from "react";
import Button from 'react-bootstrap/Button';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { FaArrowLeft } from 'react-icons/fa'
import { FcCheckmark, FcCancel } from 'react-icons/fc';

const GuessHistory = ({ currentState }) => {
    const lastTen = currentState.playersWhoGuessedLast && currentState.playersWhoGuessedLast.slice(-10);
    return (
        <div id="guess-history-div">
            <div className="stats-header">Previous Guesses</div>
            {/* <table id="previous-guesses-table">
                <tr>
                    <td>
                        {lastTen && lastTen[0] && lastTen[0].playerName}{lastTen && lastTen[0] && lastTen[0].guessWasCorrect}
                    </td>
                    <td>
                        {lastTen && lastTen[1] && lastTen[1].playerName}{lastTen && lastTen[1] && lastTen[1].guessWasCorrect}
                    </td>
                    <td>
                        {lastTen && lastTen[2] && lastTen[2].playerName}{lastTen && lastTen[2] && lastTen[2].guessWasCorrect}
                    </td>
                    <td>
                        {lastTen && lastTen[3] && lastTen[3].playerName}{lastTen && lastTen[3] && lastTen[3].guessWasCorrect}
                    </td>
                    <td>
                        {lastTen && lastTen[4] && lastTen[4].playerName}{lastTen && lastTen[4] && lastTen[4].guessWasCorrect}
                    </td>
                </tr>
            </table> */}
            {/* {currentState.playersWhoGuessedLast && currentState.playersWhoGuessedLast.slice(-70).map((item) => {
                return <div>{item.playerName} {item.guessWasCorrect === 'true' ? <FcCheckmark /> : <FcCancel />}</div>
            }).reverse()} */}
        </div>
    );
}

export default GuessHistory;
