interface ResultOfResourceVerifications {
    [event: string]: {
        allow: boolean[];
        reason?: string;
    };
}

interface ResponseOfResultOfGroupVerification {
    allow: boolean;
    data: ResultOfResourceVerifications;
}

interface GroupOfEventVerifications {
    allow: boolean[];
    reason: string[];
}

interface ResultOfVerification {
    allow: boolean;
    reason?: string;
}

interface ListOfVerifications {
    totalPointsSize: { allow: boolean; reason: string };
    points: { allow: boolean; reason: string };
}

export {
    ResultOfResourceVerifications,
    ResponseOfResultOfGroupVerification,
    GroupOfEventVerifications,
    ResultOfVerification,
    ListOfVerifications,
};
