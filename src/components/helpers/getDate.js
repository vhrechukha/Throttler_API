const minute1 = () => new Date(Date.now() - 1 * 60 * 1000);

const minute5 = () => new Date(Date.now() - 5 * 60 * 1000);

const minute30 = () => new Date(Date.now() - 30 * 60 * 1000);

const hour1 = () => new Date(Date.now() - 1 * 60 * 60 * 1000);

const hour2 = () => new Date(Date.now() - 2 * 60 * 60 * 1000);

const hour12 = () => new Date(Date.now() - 12 * 60 * 60 * 1000);

const day = () => new Date(Date.now() - 24 * 60 * 60 * 1000);

const day7 = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const date = {
  '7d': day7(),
  '1d': day(),
  '12h': hour12(),
  '2h': hour2(),
  '1h': hour1(),
  '30m': minute30(),
  '5m': minute5(),
  '1m': minute1(),
};

module.exports = date;
