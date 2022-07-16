# Stopwatch

The task is to implement stopwatch React application satisfying functional requirements listed below. The applicant is provided with github repository containing minimal application framework and backend implementation providing REST API. Documentation for the API endpoints can be found in this document.

Base application framework has following tools preconfigured:
- [React](https://reactjs.org/) (with server-side rendering);
- [React Router](https://reactrouter.com/);
- Vanilla CSS (used via `import './path-to-css-file.css'`);
- CSS-in-JS (via [Emotion](https://emotion.sh/)).

The applicant is free to choose any additional third-party modules if needed to complete the task. The applicant is free to use any other CSS-in-JS library instead of Emotion.

:warning: API is designed to respond slowly sometimes or fail at random. Use `FLUKENESS` environment variable to control it if needed.

```
FLUKENESS=5 yarn start
```

It accepts integer in range from 0 to 100, where 0 is normally functioning API, 1 to 99 — slowed down (the higher number, the slower the API is) and 100 — not working API.

By default (if no environment variable provided — `yarn start`) API behaviour is randomised.


## Look and feel

### Stopwatch list:

<img src="https://user-images.githubusercontent.com/1751980/83628971-9ebd3200-a599-11ea-82ee-a351d1a5c8ca.png" width="360">

### Single stopwatch:

<img src="https://user-images.githubusercontent.com/1751980/80348604-53af5100-886e-11ea-83b1-f26a1763ecb2.jpg" width="375">


## Requirements

- Application consists of two screens: list and single stopwatch view.
- Stopwatch list and each stopwatch state is preserved on BE.
- BE errors are handled gracefully (how errors are handled and presented is up to applicant)

### Stopwatch list

- Active items are updated in realtime (i.e. showing current time since start).
- User is able to navigate to single stopwatch view by clicking desired item.
- User is not able to control any other properties of items in stopwatch list view.
- Items are paginated (3 per page).
- User is able to create new stopwatch.
- User is redirected to single stopwatch view after creation.

### Single stopwatch view

- Stopwatch is formatted as `<hours>:<minutes>:<seconds>.<milliseconds>` (i.e. `00:02:26.081`) where `hours`, `minutes` and `seconds` is minimum two digits with preceding zero and `milliseconds` is minimum three digits with preceding zeroes.
- User is able to pause stopwatch.
- User is able to unpause stopwatch.
- User is able to reset stopwatch.
- User is able to return to stopwatch list view (UI is up to applicant).
- User is able to remove stopwatch. _(optional)_
- User is redirected to stopwatch list view after removal.
- User is able to create “lap” mark. _(optional)_
- Shortest and longest laps are highlighted. _(optional)_


# Development environment

To start the app, intall dependencies and run `npm start` or `yarn start`. Server will start and listen on http://localhost:3000/

Solution to be implemented in `src/app` folder, but you may edit any files if needed.

Environment comes with React, React Router and Emotion installed. You may also use `*.css` files if needed by importing them in your components.


# REST API documentation

- [`GET /api/stopwatches`](#get-apistopwatches)
- [`POST /api/stopwatches`](#post-apistopwatches)
- [`GET /api/stopwatches/:id`](#get-apistopwatchesid)
- [`POST /api/stopwatches/:id`](#post-apistopwatchesid)
- [`DELETE /api/stopwatches/:id`](#post-apistopwatchesid)
- [`POST /api/stopwatches/:id/toggle`](#post-apistopwatchesidtoggle)
- [`POST /api/stopwatches/:id/lap`](#post-apistopwatchesidlap)

### Stopwatch model

- `__id` — database record unique ID.
- `laps` — array of timestamps for lap marks.
- `started` — timestamp for stopwatch start time.
- `toggles` — array of timestamps when stopwatch was toggled (paused or restarted)


### `GET /api/stopwatches`

Returns paginated list of stopwatches.


#### Parameters

##### `page` _(integer; URL query; default: `1`)_

Page number to fetch.


#### Response

```js
// curl /api/stopwatches?page=2
{
  "meta": {
    "currentPage": 2,
    "totalPages": 2
  },
  "result": [
    {
      "__id": 3,
      "laps": [
        1587807696286
      ],
      "started": 1587807510806,
      "toggles": []
    },
    {
      "__id": 2,
      "laps": [],
      "started": 1587807410626,
      "toggles": [
        1587807620331,
        1587807760877,
        1587807709934,
        1587807785664
      ]
    },
    {
      "__id": 1,
      "laps": [],
      "started": 1587807345496,
      "toggles": [
        1587807652309,
        1587807686826
      ]
    }
  ]
}
```

### `POST /api/stopwatches`

Create new stopwatch with given start time.


#### Parameters

##### `started` _(integer; request body; required)_

Timestamp (in milliseconds) of stopwatch start.


#### Response

```js
// curl -X POST -d '{ "started": 1587807686826 }' /api/stopwatches
{
  "meta": {},
  "result": {
    "__id": 5,
    "laps": [],
    "started": 1587807345496,
    "toggles": []
  }
}
```


### `GET /api/stopwatches/:id`

Returns single stopwatch.


#### Parameters

##### `id` _(integer; URL path; required)_

Stopwatch ID to get.


#### Response

```js
// curl /api/stopwatches/1
{
  "meta": {},
  "result": {
    "__id": 1,
    "laps": [],
    "started": 1587807345496,
    "toggles": [
      1587807652309,
      1587807686826
    ]
  }
}
```


### `POST /api/stopwatches/:id`

Reset given stopwatch to given start time.


#### Parameters

##### `id` _(integer; URL path; required)_

Stopwatch ID to reset.

##### `started` _(integer; request body; required)_

Timestamp (in milliseconds) of stopwatch start.


#### Response

```js
// curl -X POST -d '{ "started": 1587807686826 }' /api/stopwatches/5
{
  "meta": {},
  "result": {
    "__id": 5,
    "laps": [],
    "started": 1587807345496,
    "toggles": []
  }
}
```

### `DELETE /api/stopwatches/:id`

Remove given stopwatch.


#### Parameters

##### `id` _(integer; URL path; required)_

Stopwatch ID to remove.


#### Response

Reponds with `HTTP 204` on success.


### `POST /api/stopwatches/:id/toggle`

Add toggle time for given stopwatch


#### Parameters

##### `id` _(integer; URL path; required)_

Stopwatch ID to store toggle for.


##### `time` _(integer; request body; required)_

Timestamp (in milliseconds) of stopwatch toggle.


#### Response

```js
// curl -X POST -d '{ "time": 1587807760877 }' /api/stopwatches/2/toggle
{
  "meta": {},
  "result": {
    "__id": 2,
    "laps": [],
    "started": 1587807410626,
    "toggles": [
      1587807620331,
      1587807760877
    ]
  }
}
```


### `POST /api/stopwatches/:id/lap`

Add lap time for given stopwatch


#### Parameters

##### `id` _(integer; URL path; required)_

Stopwatch ID to store lap for.


##### `time` _(integer; request body; required)_

Timestamp (in milliseconds) of lap mark.


#### Response

```js
// curl -X POST -d '{ "time": 1587807760877 }' /api/stopwatches/2/lap
{
  "meta": {},
  "result": {
    "__id": 2,
    "laps": [
      1587807760877
    ],
    "started": 1587807410626,
    "toggles": []
  }
}
```
