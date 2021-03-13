const events = {
    'pastebin.com/prod/users/kotichka': {
        points: 100,
        throttlers: [
            { max: 100000, kind: 'points' },
            { max: 5000, kind: 'count', per: '1h' },
            { max: 10000, kind: 'count', per: '1d' },
        ],
    },
    'pastebin.com/prod/categories/free-cats': {
        points: 9000,
        throttlers: [
            { max: 100000, kind: 'points' },
            { max: 10000, kind: 'points', per: '7d' },
            { max: 5000, kind: 'count', per: '2h' },
            { max: 10000, kind: 'count', per: '1d' },
        ],
    },
};

export { events };
