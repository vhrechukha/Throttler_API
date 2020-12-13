import EventDB from './interfaces/event-interface';
import IServiceResponse from './interfaces/service-response-interface';
import getDate from '../helpers/getDate';
import { Events } from './interfaces/events-interface';
const events: EventDB[] = [];

const Service = {
  async addFakeEvents(): Promise<void> {
    for (let i = 0; i < 5; i++) {
      events.push({
        event: 'pastebin.com/prod/users/kotik',
        points: 456,
        date: Date.now(),
      });
      events.push({
        event: 'pastebin.com/prod/users/free-kotiki',
        points: 11111,
        date: Date.now() - 7 * 24 * 60 * 60 * 1000,
      });
    }
  },

  addEvents(data: Events[]): void {
    Object.keys(data).forEach(event => {
      events.push({
        event,
        points: data[event].points,
        date: Date.now() - 7 * 24 * 60 * 60 * 1000,
      });
    });
  },

  async checkPointsSizeWithMaxPoints(
    points: number,
    maxPoints: number,
  ): Promise<IServiceResponse> {
    const isAllow = points < maxPoints;

    return {
      allow: isAllow,
      reason: isAllow ? '' : `> ${maxPoints} points`,
    };
  },

  async checkAmountsOfPointsOfAllEventsPerSomeTime(
    eventName: string,
    maxPoints: number,
    time: number,
  ): Promise<IServiceResponse> {
    const totalPoints = events
      .filter(e => {
        if (e.event === eventName && e.date >= getDate['1d']) {
          return e;
        }
      })
      .reduce((total: number, e) => total + e.points, 0);

    const isAllow = totalPoints === undefined || totalPoints < maxPoints;

    return {
      allow: isAllow,
      reason: isAllow ? '' : `> ${maxPoints} points per ${time}`,
    };
  },

  async checkAmountOfAllEventsPerSomeTime(
    eventName: string,
    maxEvent: number,
    time: number,
  ): Promise<IServiceResponse> {
    const totalPoints = events.filter(e => {
      if (e.event === eventName && e.date >= getDate['1d']) {
        return e;
      }
    });

    const isAllow = totalPoints === undefined || totalPoints.length < maxEvent;

    return {
      allow: isAllow,
      reason: isAllow ? '' : `> ${maxEvent} points per ${time}`,
    };
  },
};

export default Service;
