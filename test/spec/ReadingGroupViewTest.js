/* global define, describe, it */
define([
  'chai',

  'geomag/Observation',
  'geomag/ObservationBaselineCalculator',
  'geomag/Reading',
  'geomag/ReadingGroupView'
], function (
  chai,

  Observation,
  ObservationBaselineCalculator,
  Reading,
  ReadingGroupView
) {
  'use strict';


  var expect = chai.expect;
  var viewOptions = {
    observation: new Observation(),
    baselineCalculator: new ObservationBaselineCalculator()
  };

  describe('ReadingGroupView test suite.', function () {
    describe('Constructor', function () {
      it('Can be defined.', function () {
        /* jshint -W030 */
        expect(ReadingGroupView).not.to.be.undefined;
        /* jshint +W030 */
      });

      it('Can be instantiated', function () {
        var c = new ReadingGroupView(viewOptions);
        expect(c).to.be.an.instanceOf(ReadingGroupView);
      });
    });

    describe('_createTab()', function () {
      it('has such a method', function () {
        /* jshint -W030 */
        expect((new ReadingGroupView(viewOptions))._createTab)
            .to.not.be.undefined;
        /* jshint +W030 */
      });

      it('returns an object with proper keys', function () {
        var r = new ReadingGroupView(viewOptions),
            t = r._createTab(null, new Reading());

        /* jshint -W030 */
        expect(t).to.be.an.instanceOf(Object);
        expect(t.title).to.exist;
        expect(t.content).to.exist;
        /* jshint +W030 */
      });
    });
  });
});
