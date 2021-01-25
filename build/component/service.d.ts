import Event from './interfaces/event-interface';
import EventEntry from './interfaces/eventEntry-interface';
import ResultOfVerification from './interfaces/resultOfVerification-interface';
import ResponseOfResultOfEventsVerification from './interfaces/responseOfResultOfEventsVerification-interface';
declare const Service: {
    getResultOfEventsVerification(): ResponseOfResultOfEventsVerification;
    writeResult(result: ResultOfVerification): void;
    writeResultOfEvent(event: string): void;
    addEvents(data: Event, now: number, state: EventEntry[]): EventEntry[];
    checkPointsSizeWithMaxPoints(points: number, maxPoints: number): Promise<ResultOfVerification>;
    checkAmountOfPointsOfAllEventsPerSomeTime(eventName: string, maxPoints: number, time: string, now: number, state: EventEntry[]): Promise<ResultOfVerification>;
    checkAmountOfAllEventsPerSomeTime(eventName: string, maxEvent: number, time: string, now: number, state: EventEntry[]): Promise<ResultOfVerification>;
};
export default Service;
//# sourceMappingURL=service.d.ts.map