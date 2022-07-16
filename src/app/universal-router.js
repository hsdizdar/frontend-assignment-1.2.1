import * as React from 'react'
import * as ReactRouter from 'react-router-dom'

export function UniversalRouter(props) {
  if (process.env.BUILD_TARGET === 'client') {
    return (
      <ReactRouter.BrowserRouter>{props.children}</ReactRouter.BrowserRouter>
    )
  }

  return (
    <ReactRouter.StaticRouter location={props.location}>
      {props.children}
    </ReactRouter.StaticRouter>
  )
}
