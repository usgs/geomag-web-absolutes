/* global chai, describe, it */
'use strict';

var ObservationBaselineCalculator =
        require('geomag/ObservationBaselineCalculator'),
    Observation = require('geomag/Observation'),
    ObservationMetaView = require('geomag/ObservationMetaView');


var expect = chai.expect;


describe('Unit tests for ObservationMetaView', function () {
  var view = ObservationMetaView({
    calculator: ObservationBaselineCalculator(),
    observation: Observation(),
  });

  describe('getJulianDay', function () {
    it('works for basic, non-leap years', function () {
      expect(view.getJulianDay(new Date('2015-01-01 12:30:30'))).to.equal(1);
      expect(view.getJulianDay(new Date('2015-02-01 12:30:30'))).to.equal(32);
      expect(view.getJulianDay(new Date('2015-06-01 12:30:30'))).to.equal(152);
      expect(view.getJulianDay(new Date('2015-12-31 12:30:30'))).to.equal(365);
    });

    it('works for basic, leap years', function () {
      expect(view.getJulianDay(new Date('2012-01-01 12:30:30'))).to.equal(1);
      expect(view.getJulianDay(new Date('2012-02-01 12:30:30'))).to.equal(32);
      expect(view.getJulianDay(new Date('2012-06-01 12:30:30'))).to.equal(153);
      expect(view.getJulianDay(new Date('2012-12-31 12:30:30'))).to.equal(366);
    });

    it('works for centuries', function () {
      expect(view.getJulianDay(new Date('1900-01-01 12:30:30'))).to.equal(1);
      expect(view.getJulianDay(new Date('1900-02-01 12:30:30'))).to.equal(32);
      expect(view.getJulianDay(new Date('1900-06-01 12:30:30'))).to.equal(152);
      expect(view.getJulianDay(new Date('1900-12-31 12:30:30'))).to.equal(365);
    });

    it('works for millenia', function () {
      expect(view.getJulianDay(new Date('2000-01-01 12:30:30'))).to.equal(1);
      expect(view.getJulianDay(new Date('2000-02-01 12:30:30'))).to.equal(32);
      expect(view.getJulianDay(new Date('2000-06-01 12:30:30'))).to.equal(153);
      expect(view.getJulianDay(new Date('2000-12-31 12:30:30'))).to.equal(366);
    });
  });

  describe('render', function () {
    it('TODO :: Implement render tests...', function () {
      expect(false).to.equal(true);
    });
  });

});
