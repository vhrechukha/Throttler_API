const { Router } = require('express');
const ThrottlerComponent = require('.');

/**
 * Express router to mount books related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * Route for impose limits on something.
 * @name /throttler/api/event
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/event', ThrottlerComponent.eventLimiter);

module.exports = router;
