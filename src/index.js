import express from "express";
import http from "http";

import { api } from "./api";
import { createDatabase } from "./database";
import { react } from "./server/react";

const app = express();

// Parse JSON equest body
app.use(express.json())

// Init DB and inject it into `req.context`
app.use(createDatabase('build/stopwatch.db'))

app.use("/api", api);

app.use(react);

const server = http.createServer();

server.on("request", app);

server.listen(3000, () => {
  console.log('\n', 'Application is running on http://localhost:3000', '\n')
});

if (module.hot) {
  function accept() {
    const { api } = require("./api/index.js");
    const { createDatabase } = require("./database/index.js");
    const { react } = require("./server/react.js");

    const app = express();

    // Parse JSON equest body
    app.use(express.json())

    // Init DB and inject it into `req.context`
    app.use(createDatabase('build/stopwatch.db'))

    app.use("/api", api);

    app.use(react);

    server.removeAllListeners("request");

    server.on("request", app);
  }

  module.hot.accept("./api/index.js", accept);
  module.hot.accept("./database/index.js", accept);
  module.hot.accept("./server/react.js", accept);
}
