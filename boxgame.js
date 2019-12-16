// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';

const allCards = [
    {
        displayValue: '2',
        suit: 'clubs',
        strength: 2,
    },
    {
        displayValue: '3',
        suit: 'clubs',
        strength: 3,
    },
    {
        displayValue: '4',
        suit: 'clubs',
        strength: 4,
    },
    {
        displayValue: '5',
        suit: 'clubs',
        strength: 5,
    },
    {
        displayValue: '6',
        suit: 'clubs',
        strength: 6,
    },
    {
        displayValue: '7',
        suit: 'clubs',
        strength: 7,
    },
    {
        displayValue: '8',
        suit: 'clubs',
        strength: 8,
    },
    {
        displayValue: '9',
        suit: 'clubs',
        strength: 9,
    },
    {
        displayValue: '10',
        suit: 'clubs',
        strength: 10,
    },
    {
        name: 'Jack',
        displayValue: 'J',
        suit: 'clubs',
        strength: 11,
    },
    {
        name: 'Queen',
        displayValue: 'Q',
        suit: 'clubs',
        strength: 12,
    },
    {
        name: 'King',
        displayValue: 'K',
        suit: 'clubs',
        strength: 13,
    },
    {
        displayValue: 'A',
        suit: 'clubs',
        strength: 14,
    },
    {
        displayValue: '2',
        suit: 'spades',
        strength: 2,
    },
    {
        displayValue: '3',
        suit: 'spades',
        strength: 3,
    },
    {
        displayValue: '4',
        suit: 'spades',
        strength: 4,
    },
    {
        displayValue: '5',
        suit: 'spades',
        strength: 5,
    },
    {
        displayValue: '6',
        suit: 'spades',
        strength: 6,
    },
    {
        displayValue: '7',
        suit: 'spades',
        strength: 7,
    },
    {
        displayValue: '8',
        suit: 'spades',
        strength: 8,
    },
    {
        displayValue: '9',
        suit: 'spades',
        strength: 9,
    },
    {
        displayValue: '10',
        suit: 'spades',
        strength: 10,
    },
    {
        name: 'Jack',
        displayValue: 'J',
        suit: 'spades',
        strength: 11,
    },
    {
        name: 'Queen',
        displayValue: 'Q',
        suit: 'spades',
        strength: 12,
    },
    {
        name: 'King',
        displayValue: 'K',
        suit: 'spades',
        strength: 13,
    },
    {
        displayValue: 'A',
        suit: 'spades',
        strength: 14,
    },
    {
        displayValue: '2',
        suit: 'hearts',
        strength: 2,
    },
    {
        displayValue: '3',
        suit: 'hearts',
        strength: 3,
    },
    {
        displayValue: '4',
        suit: 'hearts',
        strength: 4,
    },
    {
        displayValue: '5',
        suit: 'hearts',
        strength: 5,
    },
    {
        displayValue: '6',
        suit: 'hearts',
        strength: 6,
    },
    {
        displayValue: '7',
        suit: 'hearts',
        strength: 7,
    },
    {
        displayValue: '8',
        suit: 'hearts',
        strength: 8,
    },
    {
        displayValue: '9',
        suit: 'hearts',
        strength: 9,
    },
    {
        displayValue: '10',
        suit: 'hearts',
        strength: 10,
    },
    {
        name: 'Jack',
        displayValue: 'J',
        suit: 'hearts',
        strength: 11,
    },
    {
        name: 'Queen',
        displayValue: 'Q',
        suit: 'hearts',
        strength: 12,
    },
    {
        name: 'King',
        displayValue: 'K',
        suit: 'hearts',
        strength: 13,
    },
    {
        displayValue: 'A',
        suit: 'hearts',
        strength: 14,
    },
    {
        displayValue: '2',
        suit: 'diamonds',
        strength: 2,
    },
    {
        displayValue: '3',
        suit: 'diamonds',
        strength: 3,
    },
    {
        displayValue: '4',
        suit: 'diamonds',
        strength: 4,
    },
    {
        displayValue: '5',
        suit: 'diamonds',
        strength: 5,
    },
    {
        displayValue: '6',
        suit: 'diamonds',
        strength: 6,
    },
    {
        displayValue: '7',
        suit: 'diamonds',
        strength: 7,
    },
    {
        displayValue: '8',
        suit: 'diamonds',
        strength: 8,
    },
    {
        displayValue: '9',
        suit: 'diamonds',
        strength: 9,
    },
    {
        displayValue: '10',
        suit: 'diamonds',
        strength: 10,
    },
    {
        name: 'Jack',
        displayValue: 'J',
        suit: 'diamonds',
        strength: 11,
    },
    {
        name: 'Queen',
        displayValue: 'Q',
        suit: 'diamonds',
        strength: 12,
    },
    {
        name: 'King',
        displayValue: 'K',
        suit: 'diamonds',
        strength: 13,
    },
    {
        displayValue: 'A',
        suit: 'diamonds',
        strength: 14,
    },
];

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

const stateHistory = [];

const stateFormat = {
    turnNumber: null,
    cardsRemaining: null,
    currentBoard: null,
    cardsRemovedFromDeck: null,
}

const getLatestState = () => stateHistory[stateHistory.length -1];

const getRandomCardIndex = (lengthOfCardsRemainingArray) => Math.floor(Math.random() * lengthOfCardsRemainingArray);

const getInitialBoardAndCardsRemaining = () => {
    const cardsRemaining = [...allCards];
    const initialBoard =  emptyBoardArray.map((item)=>{
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

const saveInitialState = (cardsRemaining, initialBoard) =>{
    const initialState = {...stateFormat};
    initialState.turnNumber = 0;
    initialState.cardsRemaining = cardsRemaining;
    initialState.currentBoard = initialBoard;
    initialState.cardsRemovedFromDeck = initialBoard;
    stateHistory.push(initialState);
}

const {cardsRemaining, initialBoard} = getInitialBoardAndCardsRemaining();
saveInitialState(cardsRemaining, initialBoard);
console.log(typeof cardsRemaining)
console.log(typeof initialBoard)
