import React, { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import { useIsMount } from "./hooks/useIsMount";
import { unstable_batchedUpdates } from "react-dom";
import Countdown from "./Countdown";
import CardRow from "./CardRow";
import "./MemoryGame.css";

const MemoryGame = () => {
  const emojiList = [
    "😀",
    "😂",
    "🥰",
    "😘",
    "🤪",
    "🤓",
    "🤩",
    "🥳",
    "😀",
    "😂",
    "🥰",
    "😘",
    "🤪",
    "🤓",
    "🤩",
    "🥳",
  ];
  const [gameover, setGameover] = useState(false);
  const [gameoverMessage, setGameoverMessage] = useState("");
  const [compareCards, setCompareCards] = useState(false);
  const [matchesCount, setMatchesCount] = useState(0);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useImmer({ count: 0 });
  const [firstEmoji, setFirstEmoji] = useImmer({ column: -1, row: -1, emoji: "" });
  const [secondEmoji, setSecondEmoji] = useImmer({ column: -1, row: -1, emoji: "" });
  const [cardMap, setCardMap] = useImmer([]);
  const [currentMove, setCurrentMove] = useState(0);
  const isMount = useIsMount();

  //Will run everytime compareCards value is changed.
  useEffect(() => {
    if (isMount) {
      return;
    } else if (compareCards) {
      compareCardEmoji(firstEmoji, secondEmoji);
      setCompareCards(false);
    }
  }, [compareCards]);

  //Will run makeBoard the first time the component is mounted
  useEffect(() => {
    makeBoard();
  }, []);

  //When matchesCount reaches 8 run checkwin
  useEffect(() => {
    if (matchesCount === 8) {
      checkWin();
    }
  }, [matchesCount]);
  //When timer reaches 0 run CheckWIn
  useEffect(() => {
    if (timer === 0) {
      checkWin();
    }
  }, [timer]);

  //Compares the two active emoji's
  const compareCardEmoji = (emojiOne, emojiTwo) => {
    const { column: columnOne, row: rowOne, emoji: firstEmoji } = emojiOne;
    const { column: columnTwo, row: rowTwo, emoji: secondEmoji } = emojiTwo;

    if (firstEmoji === secondEmoji) {
      setCardMap((draft) => {
        draft[columnOne][rowOne].matched = true;
        draft[columnTwo][rowTwo].matched = true;
      });
      setMatchesCount((prevMatchesCount) => prevMatchesCount + 1);
      setCurrentMove(0);
    } else {
      setCurrentMove(2);
      setScore((draft) => {
        draft.count++;
      });
    }
  };

  const checkWin = () => {
    if (timer <= 0) {
      setGameoverMessage("You ran out of time YOU LOSE!!!");
      setGameover(true);
      setCurrentMove(3);
    } else {
      setGameoverMessage("You finished in time YOU WIN!!!");
      setGameover(true);
      setCurrentMove(3);
    }
  };

  //Method for running the countdown timer
  const decreaseTime = () => {
    if (timer >= 0) {
      setTimer((prev) => prev - 1);
    }
  };

  //Make the board randomn by randomnizing an emoji array using the Durstenfeld shuffle (optimized for randomizing elements in an array)
  const makeBoard = () => {
    //Durstenfeld shuffle
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const randomnArray = shuffleArray(emojiList);

    const tempArray = [];
    let tracker = 0;

    //Creating the compareCardsMap that creates the board
    for (let i = 0; i < 4; i++) {
      const tempInnerArray = [];
      for (let j = 0; j < 4; j++) {
        const tempObj = {};
        tempObj.emoji = randomnArray[tracker];
        tempObj.flipped = false;
        tempObj.matched = false;
        tempInnerArray.push(tempObj);
        tracker++;
      }
      tempArray.push(tempInnerArray);
    }

    //Reset board state without causing a lot of re-renders because of updating state multiple times in a row
    unstable_batchedUpdates(() => {
      setScore((draft) => {
        draft.count = 0;
      });
      setCardMap(tempArray);
      setCurrentMove(0);
      setMatchesCount(0);
      setTimer(60);
      setGameoverMessage("");
      setGameover(false);
    });
  };

  const newGameClick = (event) => {
    event.preventDefault();
    makeBoard();
  };

  const handleCardClick = (row, column) => {
    //Different game states to determine what to do when a card is clicked
    switch (currentMove) {
      case 0:
        setCardMap((draft) => {
          draft[column][row].flipped = !draft[column][row].flipped;
        });
        setFirstEmoji((draft) => {
          draft.emoji = cardMap[column][row].emoji;
          draft.column = column;
          draft.row = row;
        });
        setCurrentMove(1);

        break;

      case 1:
        setCardMap((draft) => {
          draft[column][row].flipped = !draft[column][row].flipped;
        });
        setSecondEmoji((draft) => {
          draft.emoji = cardMap[column][row].emoji;
          draft.column = column;
          draft.row = row;
        });
        setCompareCards(true);

        break;

      case 2:
        setCardMap((draft) => {
          draft[firstEmoji.column][firstEmoji.row].flipped = false;
          draft[secondEmoji.column][secondEmoji.row].flipped = false;
        });
        setCurrentMove(0);

        break;

      case 3:
        makeBoard();

        break;
        default:
          return null
    }
  };

  return (
    <div className="container">
      <h1>Score: {score.count}</h1>
      <Countdown timer={timer} decreaseTime={decreaseTime} />
      <div className="memoryContainer">
        {cardMap.map((columnMap, index) => {
          return (
            <CardRow
              handleCardClick={handleCardClick}
              key={"card_row" + index}
              columnMap={columnMap}
              column={index}
            />
          );
        })}
      </div>
      <div className="spacerBox">
        {gameover && (
          <>
            <h1>{gameoverMessage}</h1>
            <p>Press anywhere on board to start a new game</p>
          </>
        )}
        {currentMove === 2 ? (
          <h1 onClick={handleCardClick}>No Match! Click board to try again</h1>
        ) : null}
      </div>
      <button className="btn" onClick={newGameClick}>
        New Game
      </button>
    </div>
  );
};

export default MemoryGame;
