import allCards from '../data-structures/all-cards'
import { getRandomCardIndex } from './helperFunctions';
const emptyBoardArray = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

const stateFormat = {
    turnNumber: null,
    cardsRemaining: null,
    currentBoard: null,
    cardsRemovedFromDeck: null,
    gameWon: false,
    gameLost: false,
    numberOfSamesies: null,
    cardDrawn: null,
    previousCard: null,
    previousGuess: null,
};

const getInitialBoardAndCardsRemaining = () => {
    const cardsRemaining = [...allCards];
    const initialBoard = emptyBoardArray.map((item) => {
        const indexOfChosenCard = getRandomCardIndex(cardsRemaining.length);
        const chosenCardDetails = cardsRemaining[indexOfChosenCard];
        cardsRemaining.splice(indexOfChosenCard, 1);
        return chosenCardDetails
    });

    return {
        cardsRemaining,
        initialBoard,
    }
};

const getInitialState = (cardsRemaining, initialBoard) => {
    const initialState = { ...stateFormat };
    initialState.turnNumber = 0;
    initialState.cardsRemaining = cardsRemaining;
    initialState.currentBoard = initialBoard;
    initialState.cardsRemovedFromDeck = [...initialBoard];
    initialState.numberOfSamesies = 0;
    return initialState;
}

export {
    getInitialBoardAndCardsRemaining,
    getInitialState
}
