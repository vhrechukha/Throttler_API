interface Throttlers {
  max: number;
  kind: string;
  per?: string;
}

interface DataEvent {
  points: number;
  throttlers: Throttlers[];
}

interface Event {
  [event: string]: DataEvent;
}

export interface Events {
  events: Event;
}
