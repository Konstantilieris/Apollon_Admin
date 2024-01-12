"use client";
import React, { useEffect, useState } from "react";

interface Props {
  words: string[];
}

const WordFlick = ({ words }: Props) => {
  const [part, setPart] = useState("");
  const [i, setI] = useState(0);
  const [offset, setOffset] = useState(0);
  const [forwards, setForwards] = useState(true);
  const [skipCount, setSkipCount] = useState(0);
  const skipDelay = 30;
  const speed = 150;
  // delay 10 sec
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (forwards) {
        if (offset >= words[i].length) {
          setSkipCount((prevSkipCount) => prevSkipCount + 1);
          if (skipCount === skipDelay) {
            setForwards(false);
            setSkipCount(0);
          }
        }
      } else {
        if (offset === 0) {
          setForwards(true);
          setI((prevI) => (prevI + 1) % words.length);
          setOffset(0);
        }
      }

      const newPart = words[i].substr(0, offset);
      if (skipCount === 0) {
        if (forwards) {
          setOffset((prevOffset) => prevOffset + 1);
        } else {
          setOffset((prevOffset) => prevOffset - 1);
        }
      }
      setPart(newPart);
    }, speed);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, offset, forwards, skipCount]);

  return (
    <div className="word text-dark400_light700 w-full font-changa text-4xl font-bold">
      {part}
    </div>
  );
};

export default WordFlick;
