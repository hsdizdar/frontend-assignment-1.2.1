import assert from "assert";
import njv from "@kinday/njv";

export class Stopwatch {
  constructor(database, id) {
    assert(
      typeof id === "number" ? !Number.isNaN(id) : typeof id !== "undefined",
      `ID must be either a number or "null"; got "${id}"`
    );

    this.database = database;
    this.id = id;
  }

  _validate(data) {
    console.log(data);
    const { errors, valid } = njv(
      {
        type: "object",
        properties: {
          $loki: {
            type: "number",
          },
          laps: {
            type: "array",
            items: {
              type: "number",
            },
          },
          meta: {
            type: "object",
          },
          started: {
            type: "number",
            minimum: 0,
            maximum: Date.now(),
          },
          toggles: {
            type: "array",
            items: {
              type: "number",
            },
          },
        },
        additionalProperties: {
          type: "null",
        },
        required: ["laps", "started", "toggles"],
      },
      data
    );

    if (!valid) {
      for (let error of errors) {
        console.error(error);
      }

      throw new Error("Given data does not adhere to the schema");
    }
  }

  create(data) {
    const collection = this.database.getCollection("stopwatches");

    this._validate(data);

    const record = collection.insert(data);

    this.id = record.$loki;

    return record;
  }

  get() {
    assert(this.id != null, "Record doesn’t exist");

    const collection = this.database.getCollection("stopwatches");
    return collection.get(this.id);
  }

  remove() {
    assert(this.id != null, "Record doesn’t exist");

    const collection = this.database.getCollection("stopwatches");

    collection.remove(this.id);
  }

  update(updater) {
    const collection = this.database.getCollection("stopwatches");
    const prevRecord = collection.get(this.id);
    const nextRecord = updater(prevRecord);

    this._validate(nextRecord);

    return collection.update(nextRecord);
  }
}
