interface ResultOfEventsVerifications {
    [event: string]: {
        allow: boolean[];
        reason?: string;
    };
}

interface ResponseOfResultOfEventsVerification {
    result: ResultOfEventsVerifications;
    allow: boolean;
}

interface GroupOfEventVerifications {
    allow: boolean[];
    reason: string[];
}

interface ResultOfVerification {
    allow: boolean;
    reason: string;
}

interface ListOfVerifications {
    totalPointsSize: { allow: boolean; reason: string };
    points: { allow: boolean; reason: string };
}

export {
    ResultOfEventsVerifications,
    ResponseOfResultOfEventsVerification,
    GroupOfEventVerifications,
    ResultOfVerification,
    ListOfVerifications,
};
