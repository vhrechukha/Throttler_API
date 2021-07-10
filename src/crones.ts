import { CronJob } from 'cron';

// FEATURE: add crone-jobs which clear old data in state
const checkEvery7Day = new CronJob('0 0 * * 0', () => 0);
const checkEveryDay = new CronJob('0 0 * * *', () => 0);
const checkEvery12Hour = new CronJob('0 */12 * * *', () => 0);
const checkEvery2Hour = new CronJob('0 */2 * * *', () => 0);
const checkEveryHour = new CronJob('0 * * * *', () => 0);
const checkEvery30Minute = new CronJob('*/30 * * * *', () => 0);
const checkEvery5Minute = new CronJob('*/5 * * * *', () => 0);
const checkEvery1Minute = new CronJob('* * * * *', () => 0);

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
