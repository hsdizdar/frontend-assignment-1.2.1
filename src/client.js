import * as React from "react";
import * as ReactDOM from "react-dom";

import { Root } from "./app/root";

const element = document.querySelector("[data-app-root]");

ReactDOM.hydrate(<Root />, element);

if (module.hot) {
  module.hot.accept("./app/root.js", async () => {
    const { Root } = await import("./app/root.js");
    ReactDOM.render(<Root />, element);
  });
}
