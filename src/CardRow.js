import React from "react";
import Card from "./Card";
import "./CardRow.css";

const CardRow = (props) => {
  const { column, handleCardClick, columnMap } = props;
  return (
    <div class="cardRowContainer">
    {columnMap.map((cardObj, index) => {
      return (
        <Card
          handleCardClick={handleCardClick}
          column={column}
          row={index}
          key={"card" + index}
          emoji={cardObj.emoji}
          flipped={cardObj.flipped}
          matched={cardObj.matched}
        />
      );
    })}
  </div>
  );
};

export default CardRow;
