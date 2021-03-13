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
    resultOfTotalPointsSize: { allow: boolean; reason: string };
    resultOfPoints: { allow: boolean; reason: string };
    resultOfSumEvents: { allow: boolean; reason: string };
}

export {
    ResultOfEventsVerifications,
    ResponseOfResultOfEventsVerification,
    GroupOfEventVerifications,
    ResultOfVerification,
    ListOfVerifications,
};
