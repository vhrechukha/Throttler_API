const express = require('express');

const ThrottlerRouter = require('../components/Throttler/router');

module.exports = {
  /**
     * @function
     * @param {express.Application} app
     * @summary init Application router
     * @returns void
     */
  init(app) {
    const router = express.Router();

    /**
     * Forwards any requests to the /throttler/api URI to ThrottlerRouter.
     * @name /throttler/api
     * @function
     * @inner
     * @param {string} path - Express path
     * @param {callback} middleware - Express middleware.
     */
    app.use('/throttler/api', ThrottlerRouter);

    /**
     * @function
     * @inner
     * @param {express.Router}
     */
    app.use(router);
  },
};
