import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DeckOfCards.css";

const DeckofCards = () => {
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]);
  const [remaining, setRemaining] = useState(52);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    const getDeck = async () => {
      const response = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/"
      );
      setDeckId(response.data.deck_id);
    };
    getDeck();
  }, []);

  const drawCard = async () => {
    if (remaining === 0) {
      alert("Error: No cards remaining!");
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

  const shuffleDeck = async () => {
    setIsShuffling(true);
    try {
      await axios.get(`https://deckofcardsapi.com/api/deck/$${deckId}/shuffle`);
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
      <button onClick={drawCard} disabled={isShuffling}>
        Draw a card
      </button>
      <button onClick={shuffleDeck} disabled={setIsShuffling}>
        Shuffle
      </button>
      <di className="cards-container">
        {cards.map((card, index) => (
          <img
            key={index}
            src={card.image}
            alt={`${card.value} of ${card.suit}`}
          />
        ))}
      </di>
    </div>
  );
};

export default DeckofCards;
