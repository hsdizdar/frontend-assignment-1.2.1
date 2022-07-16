import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'

import prepass from 'react-ssr-prepass'

import {Document} from './document'
import {Root} from '../app/root'

export async function react(req, res) {
  const tree = <Root location={req.url} />

  await prepass(tree)

  const html = ReactDOMServer.renderToStaticMarkup(<Document>{tree}</Document>)

  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(`<!DOCTYPE html>${html}`, 'utf8')
}
