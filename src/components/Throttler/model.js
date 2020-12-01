const { Schema } = require('mongoose');
const connection = require('../../config/connection');

const EventSchema = new Schema(
  {
    event: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
    },
    time: {
      type: Date,
      default: Date.now,
      index: { expires: 604800 }, // 604800 -> 7 day
    },
  },
  {
    collection: 'events',
    versionKey: false,
  },
);

module.exports = connection.model('EventModel', EventSchema);
