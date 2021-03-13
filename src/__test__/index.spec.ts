import { expect } from 'chai';
import { throttler } from '../component';
import { Throtthler } from '../helpers/runtypes';

import dbDataHelper from './db-data-helper';
import { events } from './request-data-helper';

describe('throttler', () => {
    it('test with not repeated events', done => {
        if (Throtthler.guard(events)) {
            const state = dbDataHelper.getStateWithNotRepeatedEvents();

            throttler(events, state, Date.now())
                .then(res => {
                    expect(res).to.have.property('allow', true);
                    expect(res)
                        .to.have.property('data')
                        .to.be.an('object');
                    expect(res.newState).to.be.an('object');

                    done();
                })
                .catch(done);
        }
    });
    it('test with repeated events', done => {
        if (Throtthler.guard(events)) {
            const state = dbDataHelper.getStateWithRepeatedEvents();

            throttler(events, state, Date.now())
                .then(res => {
                    expect(res).to.have.property('allow', false);
                    expect(res)
                        .to.have.property('data')
                        .to.be.an('object');
                    expect(res.newState).to.be.an('null');

                    done();
                })
                .catch(done);
        }
    });
});
