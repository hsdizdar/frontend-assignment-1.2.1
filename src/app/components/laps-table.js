import React, { useEffect } from "react";

import Lap from "./lap";

const LapsTable = ({ laps, timer }) => {
  const savedLaps = laps.slice(1);

  return (
    <>
      {laps.map((lap, index) => (
        <Lap
          number={laps.length - index}
          key={laps.length - index}
          interval={index === 0 ? timer + lap : lap}
          isFastest={savedLaps.length > 2 && lap === Math.max(...savedLaps)}
          isSlowest={savedLaps.length > 2 && lap === Math.min(...savedLaps)}
        />
      ))}
    </>
  );
};

export default LapsTable;
