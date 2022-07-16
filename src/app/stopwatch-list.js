import React, { useEffect, useState } from "react";

import { useHistory, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import ClipLoader from "react-spinners/ClipLoader";

import Timer from "./components/timer";
import { saveToggles } from "./api";

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
  height: 400px;
  overflow-y: scroll;
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
  margin: 1rem 0;
`;

const Button = styled.button`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background-color: #333333;
  color: ${({ disabled }) => (disabled ? "#64686b" : "#FFFFFF")};
  border: none;
`;

const StopButton = styled.button`
  width: 5rem;
  height: 1.5rem;
  background-color: #333333;
  border-radius: 1rem;
  color: ${({ disabled }) => (disabled ? "#64686b" : "#FFFFFF")};
  border: none;
  margin: auto;
`;

const StopwatchButton = styled.button`
  display: flex;
  width: 100%;
  background-color: #000;
  border: none;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  border-bottom: 1px solid #333333;
`;

const StopwatchList = () => {
  const history = useHistory();
  const { state } = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [stopwatches, setStopwatches] = useState();
  const [time, setTime] = useState(state?.stopwatchTime || 0);
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [page, setPage] = useState(0);
  const [isRunning, setIsRunning] = useState(state?.isRunning || false);

  let interval;

  useEffect(() => {
    if (isRunning) {
      interval = setInterval(() => {
        const now = new Date().getTime();

        setTime(time + now - startTime);
      }, 100);
    } else if (!isRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    getStopWatches();
  }, []);

  const getStopWatches = (page = 1) => {
    setIsLoading(true);
    fetch(`/api/stopwatches?page=${page}`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const newStopwatches = {
          meta: data.meta,
          result: stopwatches
            ? [...stopwatches.result, ...data.result]
            : data.result,
        };

        setStopwatches(newStopwatches);

        if (isRunning && state?.stopwatchId) {
          const tempRunningStopwatch = data.result.find(
            (stopwatch) => stopwatch.__id === state?.stopwatchId
          );

          setTime(getInterval(tempRunningStopwatch));
        }
      })
      .catch((err) => {
        console.log("Error: ", err);
        alert("Failed to pull stopwatch list");
        getStopWatches();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const showMore = () => {
    if (stopwatches?.meta.currentPage < stopwatches?.meta.totalPages) {
      setPage(stopwatches?.meta.currentPage + 1);
      getStopWatches(stopwatches?.meta.currentPage + 1);
    }
  };

  const getInterval = (stopwatch) => {
    let interval;

    if (stopwatch.toggles.length > 0) {
      interval = Math.max(...stopwatch.toggles.map((item) => item));
    } else {
      interval = stopwatch.started;
    }

    return interval;
  };

  const stop = async () => {
    try {
      await saveToggles(state?.stopwatchId, time);
      setStartTime(0);
      setIsRunning(false);
      window.history.replaceState({}, document.title);

      const newStopwatches = {
        meta: stopwatches.meta,
        result: stopwatches.result.map((item) => ({
          ...item,
          toggles:
            item.__id === state?.stopwatchId
              ? [...item.toggles, time]
              : item.toggles,
        })),
      };

      setStopwatches(newStopwatches);
    } catch (error) {
      alert("Failed to save stop toggle. Please try again.");
    }
  };

  return (
    <Container>
      <ButtonLine>
        <Button
          disabled={isLoading}
          onClick={() =>
            history.push({
              pathname: "/stopwatch",
              state: { isNewStopwatch: true },
            })
          }
        >
          New
        </Button>
      </ButtonLine>
      <Content>
        {isLoading && (
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
        )}
        {!isLoading &&
          stopwatches?.result?.map((stopwatch) => (
            <ButtonsContainer key={stopwatch.__id}>
              <StopwatchButton
                onClick={() =>
                  history.push({
                    pathname: "/stopwatch",
                    state: { isNewStopwatch: false, stopwatch },
                  })
                }
              >
                <Timer
                  isStopWatch={false}
                  interval={
                    isRunning && state?.stopwatchId === stopwatch.__id
                      ? time
                      : getInterval(stopwatch)
                  }
                />
              </StopwatchButton>
              {isRunning && state?.stopwatchId === stopwatch.__id && (
                <StopButton onClick={stop}>Stop</StopButton>
              )}
            </ButtonsContainer>
          ))}
      </Content>
      {stopwatches?.meta.totalPages > 1 &&
        page !== stopwatches?.meta.totalPages && (
          <ButtonLine>
            <Button onClick={showMore}>More</Button>
          </ButtonLine>
        )}
    </Container>
  );
};

export default StopwatchList;
