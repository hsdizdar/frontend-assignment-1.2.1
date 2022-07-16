import * as R from 'ramda'
import Loki from 'lokijs'
import LokiFsStructuredAdapter from 'lokijs/src/loki-fs-structured-adapter'

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

function seedStopwatches(collection) {
  const now = Date.now()

  const data = R.times((i) => {
    const offset = random(1, 1000) * random(1, 60) * random(1, 5) * i
    const started = now - offset

    const toggles = R.pipe(
      R.times(() => random(0, offset)),
      R.uniq,
      R.sort(R.ascend(R.identity)),
      R.map(R.add(now))
    )(random(0, 10))

    const laps = R.pipe(
      R.times(() => random(0, offset)),
      R.uniq,
      R.sort(R.ascend(R.identity)),
      R.map(R.add(now)),
      R.filter((lap) =>
        R.reduce(
          (acc, [paused, started = Infinity]) => {
            if (lap > paused && lap < started) {
              return R.reduced(true)
            }

            return acc
          },
          false,
          R.splitEvery(2, toggles)
        )
      )
    )(random(0, 5))

    return {
      laps,
      started,
      toggles,
    }
  }, 5)

  R.forEach(
    (datum) => collection.insert(datum),
    R.sort((a, b) => a.started - b.started, data)
  )
}

export function createDatabase() {
  let database = null

  return function middleware(req, res, next) {
    req.context = req.context || {}

    if (database) {
      req.context.database = database

      next()
    } else {
      database = new Loki('build/stopwatch.db', {
        adapter: new LokiFsStructuredAdapter(),
        autoload: true,
        autoloadCallback() {
          if (database.getCollection('stopwatches') == null) {
            const collection = database.addCollection('stopwatches')
            seedStopwatches(collection)
          }

          req.context.database = database

          next()
        },
        autosave: true,
      })
    }
  }
}
