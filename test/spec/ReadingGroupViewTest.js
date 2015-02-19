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

  describe('_createTab()', function () {
    it('has such a method', function () {
      /* jshint -W030 */
      expect((ReadingGroupView(viewOptions))._createTab)
          .to.not.be.undefined;
      /* jshint +W030 */
    });

    it('returns an object with proper keys', function () {
      var r = ReadingGroupView(viewOptions),
          t = r._createTab(null, Reading());

      /* jshint -W030 */
      expect(t.title).to.exist;
      expect(t.content).to.exist;
      /* jshint +W030 */
    });
  });
});
