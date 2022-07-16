import React, { useState, useEffect } from "react";

import { useLocation, useHistory } from "react-router-dom";
import styled from "@emotion/styled";
import ClipLoader from "react-spinners/ClipLoader";

import Timer from "./components/timer";
import LapsTable from "./components/laps-table";

import {
  createStopwatch,
  saveToggles,
  saveLaps,
  resetStopwatch,
  deleteStopwatch,
} from "./api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #000;
  width: 34.5rem;
  height: 700px;
  padding: 2rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 300px;
  overflow-y: scroll;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const ButtonLine = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  background-color: #000;
  border: 1px solid #333333;
`;

const Button = styled.button`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background-color: #333333;
  color: ${({ disabled }) => (disabled ? "#64686b" : "#FFFFFF")};
  border: none;
`;

const HeaderButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const BackButton = styled.button`
  width: auto;
  background-color: #333333;
  color: ${({ disabled }) => (disabled ? "#64686b" : "#FFFFFF")};
  border: none;
  border-radius: 1.5rem;
  padding: 0.75rem;
  align-self: flex-start;
`;

const DeleteButton = styled.button`
  width: auto;
  background-color: ${({ disabled }) => (disabled ? "#333333" : "#cc3531")};
  color: ${({ disabled }) => (disabled ? "#64686b" : "#FFFFFF")};
  border: none;
  border-radius: 1.5rem;
  padding: 0.75rem;
  align-self: flex-start;
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 1rem;
  background-color: #333333;
`;

const Stopwatch = () => {
  const history = useHistory();
  const { state } = useLocation();

  const startedTime =
    state?.stopwatch?.toggles?.length > 0
      ? Math.max(...state?.stopwatch?.toggles?.map((item) => item))
      : state?.stopwatch?.started;

  const [isLoading, setIsLoading] = useState(false);
  const [isNewStopwatch, setIsNewStopwatch] = useState(state?.isNewStopwatch);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(startedTime || 0);
  const [startTime, setStartTime] = useState(startedTime || 0);
  const [nowTime, setNowTime] = useState(0);
  const [laps, setLaps] = useState(state?.stopwatch?.laps?.reverse() || []);

  const totalLaps = laps.reduce((total, curr) => total + curr, 0);

  let interval;

  useEffect(() => {
    if (isRunning) {
      interval = setInterval(() => {
        const now = new Date().getTime();

        setNowTime(now);
        setTime(time + now - startTime);
      }, 100);
    } else if (!isRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const clear = () => {
    setIsRunning(false);
    clearInterval(interval);
    setTime(startedTime);
    setIsNewStopwatch(state?.isNewStopwatch);
    setLaps(laps.slice(1));
  };

  const start = async () => {
    !isNewStopwatch && setIsNewStopwatch(true);
    setIsRunning(true);

    const now = new Date().getTime();
    setStartTime(now);
    setNowTime(now);

    if (laps.length === 0) {
      if (state?.isNewStopwatch) {
        setLaps([0]);
      } else {
        setLaps([startTime]);
      }
    } else if (state?.stopwatch?.laps?.length === laps.length) {
      setLaps([0, ...laps]);
    }

    if (!state?.isNewStopwatch) {
      try {
        await saveToggles(state?.stopwatch.__id, totalLaps + startTime);
      } catch (error) {
        clear();
        alert("Failed to save start toggle. Please try again.");
      }
    }
  };

  const stop = async () => {
    setIsRunning(false);
    const [firstLap, ...other] = laps;

    setStartTime(0);
    setNowTime(0);
    setLaps([firstLap + nowTime - startTime, ...other]);

    if (!state?.isNewStopwatch) {
      try {
        await saveToggles(state?.stopwatch.__id, time);
      } catch (error) {
        clear();
        alert("Failed to save stop toggle. Please try again.");
      }
    }
  };

  const lap = async () => {
    const timestamp = new Date().getTime();
    const [firstLap, ...other] = laps;

    setStartTime(timestamp);
    setNowTime(timestamp);
    setLaps([0, firstLap + nowTime - startTime, ...other]);

    if (!state?.isNewStopwatch) {
      try {
        await saveLaps(state?.stopwatch.__id, firstLap + nowTime - startTime);
      } catch (error) {
        clear();
        alert("Failed to save lap. Please try again.");
      }
    }
  };

  const reset = async () => {
    !isNewStopwatch && setIsNewStopwatch(true);

    setStartTime(0);
    setNowTime(0);
    setLaps([]);

    if (!state?.isNewStopwatch) {
      try {
        setIsLoading(true);
        await resetStopwatch(state?.stopwatch.__id, 0);
        alert(
          "Succedded to reset stopwatch. If you want, you can record a new stopwatch "
        );
      } catch (error) {
        clear();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = async () => {
    const time = totalLaps + nowTime - startTime;

    if (state?.isNewStopwatch && time > 0) {
      if (isRunning) {
        alert("Stop the stopwatch before leaving this page.");
      } else {
        try {
          setIsLoading(true);
          await createStopwatch(time);
          history.goBack();
        } catch (err) {
          alert("Failed to create stopwatch. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      if (isRunning) {
        history.push({
          pathname: "/",
          state: {
            isRunning: isRunning,
            stopwatchId: state?.stopwatch.__id,
            stopwatchTime: time,
          },
        });
      } else {
        history.push({
          pathname: "/",
          state: {},
        });
      }
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await deleteStopwatch(state?.stopwatch.__id);
      alert(response);
      history.goBack();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <HeaderButtonContainer>
        <BackButton disabled={isLoading} onClick={handleBack}>
          Back
        </BackButton>
        {!state?.isNewStopwatch && (
          <DeleteButton disabled={isLoading} onClick={handleDelete}>
            Delete
          </DeleteButton>
        )}
      </HeaderButtonContainer>
      <Timer isStopWatch interval={time} />
      {isNewStopwatch && laps.length === 0 && (
        <ButtonsContainer>
          <ButtonLine>
            <Button disable>Lap</Button>
          </ButtonLine>
          <ButtonLine>
            <Button onClick={start}>Start</Button>
          </ButtonLine>
        </ButtonsContainer>
      )}
      {isNewStopwatch && startTime > 0 && (
        <ButtonsContainer>
          <ButtonLine>
            <Button disabled={isLoading} onClick={lap}>
              Lap
            </Button>
          </ButtonLine>
          <ButtonLine>
            <Button disabled={isLoading} onClick={stop}>
              Stop
            </Button>
          </ButtonLine>
        </ButtonsContainer>
      )}
      {isNewStopwatch && laps.length > 0 && startTime === 0 && (
        <ButtonsContainer>
          <ButtonLine>
            <Button disabled={isLoading} onClick={reset}>
              Reset
            </Button>
          </ButtonLine>
          <ButtonLine>
            <Button disabled={isLoading} onClick={start}>
              Start
            </Button>
          </ButtonLine>
        </ButtonsContainer>
      )}
      {!isNewStopwatch && (
        <ButtonsContainer>
          <ButtonLine>
            <Button disabled={isLoading} onClick={reset}>
              Reset
            </Button>
          </ButtonLine>
          <ButtonLine>
            <Button disabled={isLoading} onClick={start}>
              Start
            </Button>
          </ButtonLine>
        </ButtonsContainer>
      )}
      <HorizontalLine />
      <Content>
        {isLoading ? (
          <ClipLoader
            color="#333333"
            loading={isLoading}
            cssOverride={{
              display: "block",
              margin: "auto",
              borderColor: "#333333",
            }}
            size={50}
          />
        ) : (
          <LapsTable laps={laps} timer={isRunning ? nowTime - startTime : 0} />
        )}
      </Content>
    </Container>
  );
};

export default Stopwatch;
