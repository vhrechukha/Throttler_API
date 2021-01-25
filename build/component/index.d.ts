import Event from './interfaces/event-interface';
import ResultOfEventsVerifications from './interfaces/resultOfEventsVerifications-interface';
import EventEntry from './interfaces/eventEntry-interface';
export declare function throttler(data: {
    events: Event;
}, state: EventEntry[], now: number): Promise<{
    allow: boolean;
    data: ResultOfEventsVerifications;
    newState: EventEntry[] | null;
}>;
//# sourceMappingURL=index.d.ts.map