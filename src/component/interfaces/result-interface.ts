export interface DataEvent {
  allow: boolean[];
  reason?: string;
}

export interface ResultOfEvents {
  [event: string]: DataEvent;
}
