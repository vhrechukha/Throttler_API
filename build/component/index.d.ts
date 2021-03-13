import { Throtthler, EventEntry } from '../helpers/runtypes';
import { ResultOfEventsVerifications } from '../helpers/interfaces';
export declare function throttler(events: Throtthler, state: EventEntry, now: number): Promise<{
    allow: boolean;
    data: ResultOfEventsVerifications;
    newState: EventEntry | null;
}>;
//# sourceMappingURL=index.d.ts.map