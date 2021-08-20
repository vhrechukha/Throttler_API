import { CronJob } from 'cron';

import { state } from './index';
import service from './service';

export const clearOldDataEvery5Minute = new CronJob('*/5 * * * *', () => service.clearOldData(state, Date.now()));
