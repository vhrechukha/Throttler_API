import { CronJob } from 'cron';

import { state } from './index';
import service from './service';

const clearOldDataEvery5Minute = new CronJob('* * * * *', () => service.clearOldData(state, Date.now()));

export { clearOldDataEvery5Minute };
