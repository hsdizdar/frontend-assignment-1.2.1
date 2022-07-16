import React from "react";

import styled from "@emotion/styled";

import Timer from "./timer";

const View = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #151515;
  width: 100%;
`;

const Text = styled.p`
  color: ${({ isSlowLap, isFastLap }) =>
    isSlowLap ? "#4BC05F" : isFastLap ? "#CC3531" : "#FFFFFF"};
  font-size: 20px;
`;

const Lap = ({ number, interval, isFastest, isSlowest }) => {
  return (
    <View>
      <Text isFastLap={isFastest} isSlowLap={isSlowest}>
        Lap {number}:
      </Text>
      <Timer
        isFastLap={isFastest}
        isSlowLap={isSlowest}
        isStopWatch={false}
        interval={interval}
      />
    </View>
  );
};

export default Lap;
