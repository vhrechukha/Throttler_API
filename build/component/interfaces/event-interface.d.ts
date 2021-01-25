interface Event {
    [event: string]: {
        points: number;
        throttlers: Array<{
            max: number;
            kind: string;
            per?: string;
        }>;
    };
}
export default Event;
//# sourceMappingURL=event-interface.d.ts.map