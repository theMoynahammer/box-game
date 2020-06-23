import cloneDeep from 'lodash/cloneDeep';


const incorrectGuessCardFormat = {
    spotIsStillValid: false,
    imgPath: process.env.PUBLIC_URL + `/cardback.jpg`
};

const getRandomCardIndex = (lengthOfCardsRemainingArray) => Math.floor(Math.random() * lengthOfCardsRemainingArray);

const setGameLostProperty = ({currentBoard, cardsRemaining}) => {
    const spotsStillValid = currentBoard.some(item=>item.spotIsStillValid === true);
    if (spotsStillValid){
        return false;
    }
    else if (spotsStillValid && cardsRemaining.length === 0){
        return true;
    }
    else{
        return true;
    }
}
const setGameWonProperty = ({currentBoard, cardsRemaining}) => {
    const spotsAreStillValid = currentBoard.some(item=>item.spotIsStillValid === true)
    if (cardsRemaining.length === 0 && spotsAreStillValid){
        return true;
    }
    else{
        return false;
    }
} 

const wasGuessCorrect = (currentCardStrength, chosenCardStrength, higherLowerOrSamesies) =>{
    if (higherLowerOrSamesies === 'Higher'){
        return chosenCardStrength>currentCardStrength;
    }
    else if (higherLowerOrSamesies === 'Lower'){
        return chosenCardStrength<currentCardStrength;
    }
    else if (higherLowerOrSamesies === 'Samesies'){
        return chosenCardStrength === currentCardStrength;
    }
}

const formatRemainingCardsCount = (cardsRemaining)=> {
    const cardCounts= {
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        J: 0,
        Q: 0,
        K: 0,
        A: 0,
    }
    cardsRemaining.forEach(card=> cardCounts[card.displayValue]++)
    const formattedTextArray = [];
    for (let key in cardCounts){
        formattedTextArray.push(`${key} - count: ${cardCounts[key]}`);
    }
    return formattedTextArray;
}

const evaluateGuess = (i, higherLowerOrSamesies, currentState) => {
    const newState = cloneDeep(currentState);
    const currentCard = currentState.currentBoard[i];
    const currentCardStrength = currentCard.strength;
    const newRandomCardIndex = getRandomCardIndex(newState.cardsRemaining.length);
    const chosenCardDetails = newState.cardsRemaining[newRandomCardIndex];
    const cardDrawn = `${chosenCardDetails.name ? chosenCardDetails.name : chosenCardDetails.displayValue} of ${chosenCardDetails.suit}`;
    const previousCard = `${currentCard.name ? currentCard.name : currentCard.displayValue} of ${currentCard.suit}`;
    const chosenCardStrength = chosenCardDetails.strength;
    const newNumberOfSamesies = chosenCardStrength === currentCardStrength ? currentState.numberOfSamesies + 1 : currentState.numberOfSamesies;
    // const guessWasCorrect = higherLowerOrSamesies === 'higher' ? chosenCardStrength > currentCardStrength : chosenCardStrength < currentCardStrength;
    const guessWasCorrect = wasGuessCorrect(currentCardStrength, chosenCardStrength, higherLowerOrSamesies)
    newState.cardsRemaining.splice(newRandomCardIndex, 1);
    newState.turnNumber++;
    newState.currentBoard[i] = guessWasCorrect ? chosenCardDetails : incorrectGuessCardFormat;
    newState.cardsRemovedFromDeck.push(chosenCardDetails);
    newState.gameLost = setGameLostProperty(newState);
    newState.gameWon = setGameWonProperty(newState);
    newState.numberOfSamesies = newNumberOfSamesies;
    newState.cardDrawn = cardDrawn;
    newState.previousCard = previousCard;
    newState.previousGuess = higherLowerOrSamesies;
    return {
        newState,
    };
}

export {
    evaluateGuess,
    getRandomCardIndex,
    formatRemainingCardsCount,
}
