import Url from 'url'
import assert from 'assert'
import express from 'express'
import {json as jsonBodyParser} from 'body-parser'

import * as Models from './models'

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

export const api = express.Router()

function toStopwatch(record) {
  return {
    __id: record.$loki,
    laps: record.laps,
    started: record.started,
    toggles: record.toggles,
  }
}

api.use(function flukes(req, res, next) {
  const flukeness =
    process.env.FLUKENESS != null
      ? Math.max(0, Math.min(100, parseInt(process.env.FLUKENESS, 10)))
      : random(1, 110)

  if (flukeness >= 100) {
    throw new Error('All your base are belong to us')
  } else if (flukeness > 0) {
    setTimeout(() => {
      next()
    }, flukeness * 30)
  } else {
    next()
  }
})

api
  .route('/stopwatches/:id/lap')
  .post(function stopwatchLap__post(req, res) {
    const id = parseInt(req.params.id, 10)
    const {database} = req.context

    const stopwatch = new Models.Stopwatch(database, id)

    const result = toStopwatch(stopwatch.update(record => ({
      ...record,
      laps: [...record.laps, req.body.time],
    })))

    res.json({
      meta: {},
      result,
    })
  })

api
  .route('/stopwatches/:id/toggle')
  .post(function stopwatchToggle__post(req, res) {
    const id = parseInt(req.params.id, 10)
    const {database} = req.context

    const stopwatch = new Models.Stopwatch(database, id)

    const result = toStopwatch(stopwatch.update(record => ({
      ...record,
      toggles: [...record.toggles, req.body.time],
    })))

    res.json({
      meta: {},
      result,
    })
  })

api
  .route('/stopwatches/:id')
  .get(function stopwatch__get(req, res) {
    const id = parseInt(req.params.id, 10)
    const {database} = req.context

    const stopwatch = new Models.Stopwatch(database, id)

    const result = toStopwatch(stopwatch.get())

    res.json({
      meta: {},
      result,
    })
  })
  .delete(function stopwatch__delete(req, res) {
    const id = parseInt(req.params.id, 10)
    const {database} = req.context

    const stopwatch = new Models.Stopwatch(database, id)

    stopwatch.remove()

    res.status(204).end()
  })
  .patch(function stopwatch__patch(req, res) {
    const id = parseInt(req.params.id, 10)
    const {database} = req.context

    const stopwatch = new Models.Stopwatch(database, id)

    const result = toStopwatch(
      stopwatch.update(record => ({
        ...record,
        ...req.body,
      }))
    )

    res.json({
      meta: {},
      result,
    })
  })
  .post(function stopwatch__post(req, res) {
    const id = parseInt(req.params.id, 10)
    const {database} = req.context

    const stopwatch = new Models.Stopwatch(database, id)

    const result = toStopwatch(
      stopwatch.update(record => ({
        ...record,
        laps: [],
        started: req.body.started,
        toggles: [],
      }))
    )

    res.json({
      meta: {},
      result,
    })
  })

api
  .route('/stopwatches')
  .get(function stopwatches__get(req, res) {
    const {database} = req.context

    const collection = database.getCollection('stopwatches')

    const count = collection.count()

    const limit = 3
    const currentPage = parseInt(req.query.page, 10) || 1
    const totalPages = Math.ceil(count / limit)
    const offset = limit * (currentPage - 1)

    const view = collection.addDynamicView('list')
    view.applySimpleSort('started')

    const result = collection
      .chain()
      .sort((a, b) => b.$loki - a.$loki)
      .offset(offset)
      .limit(limit)
      .data()
      .map(toStopwatch)

    res.json({
      meta: {
        currentPage,
        totalPages,
      },
      result,
    })
  })
  .post(function stopwatches__post(req, res) {
    const {database} = req.context

    const stopwatch = new Models.Stopwatch(database, null)

    const record = stopwatch.create({
      laps: [],
      started: req.body.started,
      toggles: [],
    })

    res.json(toStopwatch(record))
  })

api.all(function notImplemented(req, res) {
  res.status(501).end()
})
