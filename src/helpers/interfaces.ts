import { ThrottlerState } from './runtypes';

interface ResultOfGroupVerifications {
    [event: string]: {
        allow: boolean[];
        reason?: string;
    };
}

interface ResponseOfResultOfGroupVerification {
    allow: boolean;
    data: ResultOfGroupVerifications;
    state: null | ThrottlerState;
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
    ResultOfGroupVerifications,
    ResponseOfResultOfGroupVerification,
    GroupOfEventVerifications,
    ResultOfVerification,
    ListOfVerifications,
};
