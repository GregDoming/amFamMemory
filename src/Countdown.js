import React, { useRef, useEffect, useState } from "react";
import "./Countdown.css";

const Countdown = (props) => {
  const { decreaseTime, timer } = props;

  let intervalRef = useRef();


  useEffect(() => {
    if (timer >= 1) {
      intervalRef.current = setInterval(decreaseTime, 1000);
    } 
    return () => clearInterval(intervalRef.current);
  }, [timer]);
  
  return (
      <p>Time Left: {timer}</p>
  );
};

export default Countdown;