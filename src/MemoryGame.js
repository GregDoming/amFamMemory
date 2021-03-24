import React, { useState, useEffect, useRef } from "react";
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
  const [pauseTimer, setPauseTimer] = useState(false);
  const [score, setScore] = useImmer({ count: 0 });
  const [firstEmoji, setFirstEmoji] = useImmer({ column: -1, row: -1, emoji: "" });
  const [secondEmoji, setSecondEmoji] = useImmer({ column: -1, row: -1, emoji: "" });
  const [cardMap, setCardMap] = useImmer([]);
  const [currentMove, setCurrentMove] = useState(0);
  const isMount = useIsMount();

  useEffect(() => {
    if (isMount) {
      return;
    } else if (compareCards) {
      compareCardEmoji(firstEmoji, secondEmoji);
      setCompareCards(false);
    }
  }, [compareCards]);

  useEffect(() => {
    makeBoard();
  }, []);

  useEffect(() => {
    if (matchesCount == 8) {
      checkWin();
    }
  }, [matchesCount]);

  useEffect(() => {
    if (timer === 0) {
      checkWin();
    }
  }, [timer]);
  // 0 = no Cards currently clicked, 1 = 1 Card currently clicked, 2 = 2 Cards currently clicked (cannot go higher than 2)

  const compareCardEmoji = (emojiOne, emojiTwo) => {
    const { column: columnOne, row: rowOne, emoji: firstEmoji } = emojiOne;
    const { column: columnTwo, row: rowTwo, emoji: secondEmoji } = emojiTwo;

    if (firstEmoji == secondEmoji) {
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

  const decreaseTime = () => {
    if (timer >= 0) {
      setTimer((prev) => prev - 1);
    }
  };

  const makeBoard = () => {
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

      setScore((draft) => {
        draft.count = 0;
      });
      tempArray.push(tempInnerArray);
    }
    setCardMap(tempArray);
    setCurrentMove(0);
    setMatchesCount(0);
    setTimer(60);
    setGameoverMessage("");
    setGameover(false);
  };

  const newGameClick = (event) => {
    event.preventDefault();
    makeBoard();
  };

  const stopTime = () => {
    setPauseTimer(true);
  };

  const handleCardClick = (row, column) => {
    switch (currentMove) {
      case 0:
        {
          setCardMap((draft) => {
            draft[column][row].flipped = !draft[column][row].flipped;
          });
          setFirstEmoji((draft) => {
            draft.emoji = cardMap[column][row].emoji;
            draft.column = column;
            draft.row = row;
          });
          setCurrentMove(1);
        }
        break;

      case 1:
        {
          setCardMap((draft) => {
            draft[column][row].flipped = !draft[column][row].flipped;
          });
          setSecondEmoji((draft) => {
            draft.emoji = cardMap[column][row].emoji;
            draft.column = column;
            draft.row = row;
          });
          setCompareCards(true);
        }
        break;

      case 2:
        {
          setCardMap((draft) => {
            draft[firstEmoji.column][firstEmoji.row].flipped = false;
            draft[secondEmoji.column][secondEmoji.row].flipped = false;
          });
          setCurrentMove(0);
        }
        break;

      case 3:
        {
          makeBoard();
        }
        break;
    }
  };

  return (
    <div className="container">
      <h1>Score: {score.count}</h1>
      <Countdown pauseTimer={pauseTimer} timer={timer} decreaseTime={decreaseTime} />
      <div class="memoryContainer">
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
