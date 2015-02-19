/* global chai, describe, it */
'use strict';

var Observation = require('geomag/Observation'),
    ObservationBaselineCalculator = require('geomag/ObservationBaselineCalculator'),
    Reading = require('geomag/Reading'),
    ReadingGroupView = require('geomag/ReadingGroupView');


var expect = chai.expect;
var viewOptions = {
  observation: Observation(),
  baselineCalculator: ObservationBaselineCalculator()
};

describe('ReadingGroupView test suite.', function () {
  describe('Constructor', function () {
    it('Can be defined.', function () {
      /* jshint -W030 */
      expect(ReadingGroupView).not.to.be.undefined;
      /* jshint +W030 */
    });
  });
});
