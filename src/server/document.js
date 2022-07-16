import * as React from "react";
import * as ReactDOMServer from "react-dom/server";

export function Document(props) {
  // eslint-disable-next-line no-eval
  const assets = eval("require")(process.env.RAZZLE_ASSETS_MANIFEST);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Stopwatch Assignment</title>
        <script src={assets.client.js} defer />
      </head>
      <body>
        <div
          dangerouslySetInnerHTML={{
            __html: ReactDOMServer.renderToString(props.children)
          }}
          data-app-root
        />
      </body>
    </html>
  );
}
