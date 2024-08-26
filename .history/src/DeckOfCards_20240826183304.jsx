import React, { useState, useEffect } from "react";
import axios from "axios";

const DeckofCards = () => {
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]);
  const [remaining, setRemaining] = useState(52);

  useEffect(() => {
    const getDeck = async () => {
      const response = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/"
      );
      setDeckId(response.data.deck_id);
    };
    getDeck();
  }, []);

  return(
    <div>
      <button onClick={drawCard}>Draw a card</button>
  <div>
    {cards.map((card, index)=> (
      <img key={index} src={card.image} alt={card.value + " of " card.suit} />
  ))}
  </div>
    </div>
  );
};

export default DeckofCards;
