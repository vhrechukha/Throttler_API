"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const component_1 = require("../component");
const runtypes_1 = require("../helpers/runtypes");
const db_data_helper_1 = __importDefault(require("./db-data-helper"));
const request_data_helper_1 = require("./request-data-helper");
describe('throttler', () => {
    it('test with not repeated events', done => {
        if (runtypes_1.Throtthler.guard(request_data_helper_1.events)) {
            const state = db_data_helper_1.default.getStateWithNotRepeatedEvents();
            component_1.throttler(request_data_helper_1.events, state, Date.now())
                .then(res => {
                chai_1.expect(res).to.have.property('allow', true);
                chai_1.expect(res)
                    .to.have.property('data')
                    .to.be.an('object');
                chai_1.expect(res.newState).to.be.an('object');
                done();
            })
                .catch(done);
        }
    });
    it('test with repeated events', done => {
        if (runtypes_1.Throtthler.guard(request_data_helper_1.events)) {
            const state = db_data_helper_1.default.getStateWithRepeatedEvents();
            component_1.throttler(request_data_helper_1.events, state, Date.now())
                .then(res => {
                chai_1.expect(res).to.have.property('allow', false);
                chai_1.expect(res)
                    .to.have.property('data')
                    .to.be.an('object');
                chai_1.expect(res.newState).to.be.an('null');
                done();
            })
                .catch(done);
        }
    });
});
//# sourceMappingURL=index.spec.js.map