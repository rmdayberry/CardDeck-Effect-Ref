import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./DeckOfCards.css";

const DeckofCards = () => {
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]);
  const [remaining, setRemaining] = useState(52);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const drawInterval = useRef(null);

  useEffect(() => {
    const getDeck = async () => {
      try {
        const response = await axios.get(
          "https://deckofcardsapi.com/api/deck/new/shuffle/"
        );
        setDeckId(response.data.deck_id);
      } catch (error) {
        console.error("Error fetching the deck:", error);
      }
    };

    getDeck();
  }, []);

  const drawCard = async () => {
    if (remaining === 0) {
      alert("Error: No cards remaining!");
      stopDrawing();
      return;
    }

    try {
      const response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      setCards([...cards, ...response.data.cards]);
      setRemaining(response.data.remaining);
    } catch (error) {
      console.error("Error Drawing a card:", error);
    }
  };

  const toggleDrawing = () => {
    if (isDrawing) {
      stopDrawing();
    } else {
      startDrawing();
    }
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setInterval(drawCard, 1000);
  };
  const stopDrawing = () => {
    setIsDrawing(false);
    clearInterval(drawInterval.current);
  };

  const shuffleDeck = async () => {
    setIsShuffling(true);
    stopDrawing();
    try {
      await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle`);
      setCards([]);
      setRemaining(52);
    } catch (error) {
      console.error("Error shuffling the deck:", error);
    } finally {
      setIsShuffling(false);
    }
  };

  return (
    <div className="deck-container">
      <button onClick={toggleDrawing} disabled={isShuffling}>
        {isDrawing ? "Stop drawing" : "Start drawing"}
      </button>
      <button onClick={shuffleDeck} disabled={isShuffling}>
        Shuffle
      </button>
      <div className="cards-container">
        {cards.map((card, index) => (
          <img
            key={index}
            src={card.image}
            alt={`${card.value} of ${card.suit}`}
            style={{ "--index": index }}
          />
        ))}
      </div>
    </div>
  );
};

export default DeckofCards;
