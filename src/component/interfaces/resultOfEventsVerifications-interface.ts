interface ResultOfEventsVerifications {
    [event: string]: {
        allow: boolean[];
        reason?: string;
    };
}

export default ResultOfEventsVerifications;
