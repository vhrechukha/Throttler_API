import { Record, Number, Static } from 'runtypes';

const PerInEventRuntype = Record({
  per: Number,
  max: Number,
});

type PerInEventRuntype = Static<typeof PerInEventRuntype>;

export { PerInEventRuntype };
