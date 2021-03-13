declare const events: {
    'pastebin.com/prod/users/kotichka': {
        points: number;
        throttlers: ({
            max: number;
            kind: string;
            per?: undefined;
        } | {
            max: number;
            kind: string;
            per: string;
        })[];
    };
    'pastebin.com/prod/categories/free-cats': {
        points: number;
        throttlers: ({
            max: number;
            kind: string;
            per?: undefined;
        } | {
            max: number;
            kind: string;
            per: string;
        })[];
    };
};
export { events };
//# sourceMappingURL=request-data-helper.d.ts.map