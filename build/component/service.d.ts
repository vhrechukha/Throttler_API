import { Throtthler, EventEntry } from '../helpers/runtypes';
import { ResponseOfResultOfEventsVerification, ResultOfVerification } from '../helpers/interfaces';
declare const Service: {
    getResultOfEventsVerification(): ResponseOfResultOfEventsVerification;
    writeResultOfThrottler(result: ResultOfVerification): void;
    writeResultOfEvent(eventName: string): void;
    addEvents(events: Throtthler, now: number, state: EventEntry): EventEntry;
    addEventAndRecalcuateResult(state: EventEntry, eventName: string, time: '7d' | '1d' | '12h' | '2h' | '1h' | '30m' | '5m' | '1m', record: {
        date: number;
        points: number;
    }): EventEntry;
    removeInactiveRecordsAndRecalcuateResult(state: EventEntry, time: '7d' | '1d' | '12h' | '2h' | '1h' | '30m' | '5m' | '1m'): EventEntry;
    checkPointsSizeWithMaxPoints(points: number, maxPoints: number): Promise<ResultOfVerification>;
    checkAmountOfPointsOfAllEventsPerSomeTime(eventName: string, maxPoints: number, time: '7d' | '1d' | '12h' | '2h' | '1h' | '30m' | '5m' | '1m', now: number, state: EventEntry): Promise<ResultOfVerification>;
    checkAmountOfAllEventsPerSomeTime(eventName: string, maxEvent: number, time: '7d' | '1d' | '12h' | '2h' | '1h' | '30m' | '5m' | '1m', now: number, state: EventEntry): Promise<ResultOfVerification>;
};
export default Service;
//# sourceMappingURL=service.d.ts.map