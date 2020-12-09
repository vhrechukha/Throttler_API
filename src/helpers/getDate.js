const date = {
  '7d': Date.now() - 7 * 24 * 60 * 60 * 1000,
  '1d': Date.now() - 24 * 60 * 60 * 1000,
  '12h': Date.now() - 12 * 60 * 60 * 1000,
  '2h': Date.now() - 2 * 60 * 60 * 1000,
  '1h': Date.now() - 1 * 60 * 60 * 1000,
  '30m': Date.now() - 30 * 60 * 1000,
  '5m': Date.now() - 5 * 60 * 1000,
  '1m': Date.now() - 1 * 60 * 1000,
};

export default date;
