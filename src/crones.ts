import { CronJob } from 'cron';

import { state } from './index';
import service from './component/service';

const clearOldDataEvery5Minute = new CronJob('*/5 * * * *', () => service.clearOldData(state, Date.now()));

export { clearOldDataEvery5Minute };
