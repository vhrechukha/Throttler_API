import { CronJob } from 'cron';

import { state } from './index';
import { clearOldData } from './service';

export const clearOldDataEvery5Minute = new CronJob('*/5 * * * *', () => clearOldData(state, Date.now()));
