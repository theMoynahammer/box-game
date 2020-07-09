import React from "react";

const PlayersInGame = ({ currentState }) => {
    return (
        <div id="players-in-gave-div">
            <h6>Players in Game:</h6>
            {/* <div id="whos-turn-is-it"> */}
            {currentState.playersInSession.map((person)=>{
                return <div style={{...(person.activePlayer && {color: 'blue'})}}>
                    {person.activePlayer && '(active) '}{person.playerName}
            {` Correct: ${person.correctGuesses} Incorrect: ${person.incorrectGuesses}`}
                    </div>
            })}
            {/* </div> */}

            
        </div>
    );
}

export default PlayersInGame;
