import EventDB from './interfaces/event-interface';
import IServiceResponse from './interfaces/service-response-interface';
import getDate from '../helpers/getDate';
import { Events } from './interfaces/events-interface';
const events: EventDB[] = [];

const UserService = {
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

  addEvents(data: Events[]) {
    Object.keys(data).forEach(event => {
      events.push({
        event,
        points: data[event].points,
        date: Date.now() - 7 * 24 * 60 * 60 * 1000,
      });
    });
  },

  async checkPoints(
    points: number,
    maxPoints: number,
  ): Promise<IServiceResponse> {
    const allow = points < maxPoints;

    return {
      allow,
      reason: allow ? '' : `> ${maxPoints} points`,
    };
  },

  async checkTotalPointsSize(
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

    const allow = totalPoints === undefined || totalPoints < maxPoints;

    return {
      allow,
      reason: allow ? '' : `> ${maxPoints} points per ${time}`,
    };
  },

  async checkTotalEvents(
    eventName: string,
    maxEvent: number,
    time: number,
  ): Promise<IServiceResponse> {
    const totalPoints = events.filter(e => {
      if (e.event === eventName && e.date >= getDate['1d']) {
        return e;
      }
    });

    const allow = totalPoints === undefined || totalPoints.length < maxEvent;

    return {
      allow,
      reason: allow ? '' : `> ${maxEvent} points per ${time}`,
    };
  },
};

export default UserService;
