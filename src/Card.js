import React from "react";
import "./Card.css";
import tick from "./Tick.svg";

const Card = (props) => {
  const { emoji, flipped, matched, handleCardClick, column, row } = props;
  let cardChoice;

  if (matched) {
    cardChoice = (
      <div className="cardFront">
        <img className="checkImg" alt="Green Check Mark" src={tick}/>
        <p className="emoji">{emoji}</p>
      </div>
    );
  } else if (!flipped) {
    cardChoice = <div className="card" onClick={() => handleCardClick(row, column)}></div>;
  } else if (flipped) {
    cardChoice = (
      <div className="cardFront">
        <p className="emoji">{emoji}</p>
      </div>
    );
  }

  return <>{cardChoice}</>;
};

export default Card;
