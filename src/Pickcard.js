import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

const Deck = () => {

    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);
   
    useEffect(function loadDeckfromApi() {
        async function fetchData() {
            const d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
            setDeck(d.data);
        }
        fetchData();
    }, []);


    async function draw() {
        const drawRes = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);
        
        const card = drawRes.data.cards[0];

        setDrawn(d => [
            ...d,
            {
                id: card.code,
                name: card.suit + " " + card.value,
                image: card.image,
            }, 
        ]);
    }

async function startShuffling() {
    setIsShuffling(true);
    await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
    setDrawn([]);
}

function renderDrawBtnIfOk() {
    if (!deck) return null;

    return (
      <button
        className="Deck-gimme"
        onClick={draw}
        disabled={isShuffling}>
        DRAW
      </button>
    );
  }

  function renderShuffleBtnIfOk() {
    if (!deck) return null;
    return (
      <button
        className="Deck-gimme"
        onClick={startShuffling}
        disabled={isShuffling}>
        SHUFFLE DECK
      </button>
    );
  }

  return (
    <main className="Deck">

      {renderDrawBtnIfOk()}
      {renderShuffleBtnIfOk()}

      <div className="Deck-cardarea">{
        drawn.map(c => (
          <Card key={c.id} name={c.name} image={c.image} />
        ))}
      </div>

    </main>
  );

}

export default Deck;