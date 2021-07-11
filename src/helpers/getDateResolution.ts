interface DateResolution {
    [event: string]: number;
}

const dateResolution: DateResolution = {
    '1000d': 1,
    '7d': 7,
    '1d': 6,
    '12h': 6,
    '2h': 6,
    '1h': 6,
    '30m': 3,
    '5m': 5,
    '1m': 2,
};

export default dateResolution;
