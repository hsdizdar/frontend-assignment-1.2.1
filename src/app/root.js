import "./main.css";

import * as React from "react";
import { Switch, Route } from "react-router-dom";

import { UniversalRouter } from "./universal-router";
import StopwatchList from "./stopwatch-list";
import Stopwatch from "./stopwatch";

export function Root(props) {
  return (
    <UniversalRouter location={props.location}>
      <Switch>
        <Route path="/" exact component={() => <StopwatchList />} />
        <Route path="/stopwatch" component={() => <Stopwatch />} />
      </Switch>
    </UniversalRouter>
  );
}
