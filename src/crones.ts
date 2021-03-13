import { CronJob } from 'cron';

import { state } from './index';
import service from './component/service';

const checkEvery7Day = new CronJob('0 0 * * 0', () => service.removeInactiveRecordsAndRecalcuateResult(state, '5m'));

const checkEveryDay = new CronJob('0 0 * * *', () => service.removeInactiveRecordsAndRecalcuateResult(state, '5m'));

const checkEvery12Hour = new CronJob('0 */12 * * *', () => service.removeInactiveRecordsAndRecalcuateResult(state, '5m'));

const checkEvery2Hour = new CronJob('0 */2 * * *', () => service.removeInactiveRecordsAndRecalcuateResult(state, '5m'));

const checkEveryHour = new CronJob('0 * * * *', () => service.removeInactiveRecordsAndRecalcuateResult(state, '5m'));

const checkEvery30Minute = new CronJob('*/30 * * * *', () => service.removeInactiveRecordsAndRecalcuateResult(state, '5m'));

const checkEvery5Minute = new CronJob('*/5 * * * *', () => service.removeInactiveRecordsAndRecalcuateResult(state, '5m'));

const checkEvery1Minute = new CronJob('* * * * *', () => service.removeInactiveRecordsAndRecalcuateResult(state, '1m'));

export {
    checkEvery1Minute,
    checkEvery5Minute,
    checkEvery30Minute,
    checkEveryHour,
    checkEvery2Hour,
    checkEvery12Hour,
    checkEveryDay,
    checkEvery7Day,
};
