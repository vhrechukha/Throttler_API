"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEvery7Day = exports.checkEveryDay = exports.checkEvery12Hour = exports.checkEvery2Hour = exports.checkEveryHour = exports.checkEvery30Minute = exports.checkEvery5Minute = exports.checkEvery1Minute = void 0;
const cron_1 = require("cron");
const index_1 = require("./index");
const service_1 = __importDefault(require("./component/service"));
const checkEvery7Day = new cron_1.CronJob('0 0 * * 0', () => service_1.default.removeInactiveRecordsAndRecalcuateResult(index_1.state, '5m'));
exports.checkEvery7Day = checkEvery7Day;
const checkEveryDay = new cron_1.CronJob('0 0 * * *', () => service_1.default.removeInactiveRecordsAndRecalcuateResult(index_1.state, '5m'));
exports.checkEveryDay = checkEveryDay;
const checkEvery12Hour = new cron_1.CronJob('0 */12 * * *', () => service_1.default.removeInactiveRecordsAndRecalcuateResult(index_1.state, '5m'));
exports.checkEvery12Hour = checkEvery12Hour;
const checkEvery2Hour = new cron_1.CronJob('0 */2 * * *', () => service_1.default.removeInactiveRecordsAndRecalcuateResult(index_1.state, '5m'));
exports.checkEvery2Hour = checkEvery2Hour;
const checkEveryHour = new cron_1.CronJob('0 * * * *', () => service_1.default.removeInactiveRecordsAndRecalcuateResult(index_1.state, '5m'));
exports.checkEveryHour = checkEveryHour;
const checkEvery30Minute = new cron_1.CronJob('*/30 * * * *', () => service_1.default.removeInactiveRecordsAndRecalcuateResult(index_1.state, '5m'));
exports.checkEvery30Minute = checkEvery30Minute;
const checkEvery5Minute = new cron_1.CronJob('*/5 * * * *', () => service_1.default.removeInactiveRecordsAndRecalcuateResult(index_1.state, '5m'));
exports.checkEvery5Minute = checkEvery5Minute;
const checkEvery1Minute = new cron_1.CronJob('* * * * *', () => service_1.default.removeInactiveRecordsAndRecalcuateResult(index_1.state, '1m'));
exports.checkEvery1Minute = checkEvery1Minute;
//# sourceMappingURL=crones.js.map