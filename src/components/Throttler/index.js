const ThrottlerService = require('./service');

/**
 * @function eventLimiter
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function eventLimiter(req, res, next) {
  try {
    const { events } = req.body;

    const result = {};
    let allow = true;

    let data,
      reason;

    let resultOfTotalFileSize,
      resultOfFileSize,
      resultOfTotalEvents;

    for (const event of Object.keys(events)) {
      data = [];
      reason = [];

      for (const element in events[event].throttlers) {
        const hasEventThrottler = Object.prototype.hasOwnProperty.call(events[event].throttlers, element);

        if (hasEventThrottler) {
          const { points } = events[event];
          const throttler = events[event].throttlers[element];

          if (throttler.kind === 'points') {
            const hasThrottlerPer = Object.prototype.hasOwnProperty.call(throttler, 'per');

            if (hasThrottlerPer) {
              // check total file size per some period of time
              resultOfTotalFileSize = await ThrottlerService.checkTotalFileSize(event, throttler.max, throttler.per);

              data.push(resultOfTotalFileSize.allow);

              if (resultOfTotalFileSize.reason !== '') reason.push(resultOfTotalFileSize.reason);
            } else {
              // check file size with some max points
              resultOfFileSize = await ThrottlerService.checkFileSize(points, throttler.max);

              data.push(resultOfFileSize.allow);

              if (resultOfFileSize.reason !== '') reason.push(resultOfFileSize.reason);
            }
          }

          if (throttler.kind === 'count') {
            // check amount of documents per some period of time
            resultOfTotalEvents = await ThrottlerService.checkTotalEvents(event, throttler.max, throttler.per);

            data.push(resultOfTotalEvents.allow);

            if (resultOfTotalEvents.reason !== '') reason.push(resultOfTotalEvents.reason);
          }
        }
      }

      reason = reason.join(' ,');

      result[event] = {
        allow: data,
        reason,
      };
    }

    if (!reason) {
      allow = false;
    } else {
      ThrottlerService.create(events);
    }

    return res.status(200).json({
      allow,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.name,
      details: error.message,
    });

    return next(error);
  }
}

module.exports = {
  eventLimiter,
};
