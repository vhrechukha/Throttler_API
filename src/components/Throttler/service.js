const ThrottlerModel = require('./model');
const getDate = require('../helpers/getDate');

/**
 * @exports
 * @method create
 * @param events
 * @returns {Promise<ThrottlerModel>}
 */
function create(events) {
  const data = [];

  Object.keys(events).forEach((element) => {
    data.push({
      event: element,
      points: events[element].points,
    });
  });

  return ThrottlerModel.create(data);
}

/**
 * @exports
 * @method checkFileSize
 * @param points
 * @param maxPoints
 * @returns {Promise<ThrottlerModel>}
 */
async function checkFileSize(points, maxPoints) {
  if (points < maxPoints) {
    return {
      allow: true,
      reason: '',
    };
  }

  return {
    allow: false,
    reason: `> ${maxPoints} points`,
  };
}

/**
 * @exports
 * @method checkTotalFileSize
 * @param eventName
 * @param maxPoints
 * @param time
 * @returns {Promise<ThrottlerModel>}
 */
async function checkTotalFileSize(eventName, maxPoints, time) {
  const agreggation = await ThrottlerModel.aggregate(
    [
      {
        $match: {
          event: eventName,
          time: {
            $gte: getDate[time],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$points',
          },
        },
      },
    ],
  );

  if (agreggation[0] === undefined || agreggation[0].total < maxPoints) {
    return {
      allow: true,
      reason: '',
    };
  }

  return {
    allow: false,
    reason: `> ${maxPoints} points per ${time}`,
  };
}

/**
 * @exports
 * @method create
 * @param eventName
 * @param maxEvents
 * @param time
 * @returns {Promise<ThrottlerModel>}
 */
async function checkTotalEvents(eventName, maxEvents, time) {
  const agreggation = await ThrottlerModel.aggregate(
    [
      {
        $match: {
          event: eventName,
          time: {
            $gte: getDate[time],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ],
  );

  if (agreggation[0] === undefined || agreggation[0].total < maxEvents) {
    return {
      allow: true,
      reason: '',
    };
  }

  return {
    allow: false,
    reason: `> ${maxEvents} events per ${time}`,
  };
}

module.exports = {
  create,
  checkFileSize,
  checkTotalFileSize,
  checkTotalEvents,
};
