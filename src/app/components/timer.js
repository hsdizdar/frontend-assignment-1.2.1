import React from "react";

import styled from "@emotion/styled";
import moment from "moment";

const View = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Text = styled.p`
  color: ${({ isSlowLap, isFastLap }) =>
    isSlowLap ? "#4BC05F" : isFastLap ? "#CC3531" : "#FFFFFF"};
  font-size: ${({ isStopWatch }) => (isStopWatch ? "76px" : "20px")};
  font-weight: "200";
`;

const Timer = ({ interval, isStopWatch, isSlowLap, isFastLap }) => {
  const pad = (time) => (time < 10 ? "0" + time : time);
  const padMilliseconds = (time) =>
    time < 100 ? ("00" + time).slice(-3) : time;

  const duration = moment.duration(interval);

  return (
    <View>
      <Text
        isStopWatch={isStopWatch}
        isFastLap={isFastLap}
        isSlowLap={isSlowLap}
      >
        {pad(duration.hours())}:
      </Text>
      <Text
        isStopWatch={isStopWatch}
        isFastLap={isFastLap}
        isSlowLap={isSlowLap}
      >
        {pad(duration.minutes())}:
      </Text>
      <Text
        isStopWatch={isStopWatch}
        isFastLap={isFastLap}
        isSlowLap={isSlowLap}
      >
        {pad(duration.seconds())},
      </Text>
      <Text
        isStopWatch={isStopWatch}
        isFastLap={isFastLap}
        isSlowLap={isSlowLap}
      >
        {padMilliseconds(duration.milliseconds())}
      </Text>
    </View>
  );
};

export default Timer;
