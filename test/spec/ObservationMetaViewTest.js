/* global after, before, chai, describe, it, sinon */
'use strict';

var ObservationBaselineCalculator =
        require('geomag/ObservationBaselineCalculator'),
    Observation = require('geomag/Observation'),
    ObservationMetaView = require('geomag/ObservationMetaView'),
    Xhr = require('util/Xhr');


var expect = chai.expect;


describe('Unit tests for ObservationMetaView', function () {
  var calculator,
      observation,
      view;

  before(function () {
    calculator = ObservationBaselineCalculator();
    observation = Observation();

    sinon.stub(Xhr, 'ajax', function (options) {
      options.success([]);
    });

    view = ObservationMetaView({
      calculator: calculator,
      observation: observation,
    });
  });

  after(function () {
    if (typeof Xhr.ajax.restore === 'function') {
      Xhr.ajax.restore();
    }
  });


  // PhantomJS doesn't parse dates properly. This should work fine in
  // browser testing, and should be verified periodically. This should be
  // fixed in PhantomJS 2.0.x, but the grunt plugin needs to be updated.
  describe.skip('getJulianDay', function () {
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
    it('can be called without blowing up', function () {
      view.render();
    });

    it('is called when observation changes', function () {
      var spy = sinon.spy(view, 'render');

      observation.trigger('change');

      expect(spy.callCount).to.equal(1);
      spy.restore();
    });

    it('updates the date, julianDay, and pierTemp fields', function () {
      var //dateEl = view.el.querySelector('.observation-date'),
          // julianEl = view.el.querySelector('.julian-day-value'),
          tempEl = view.el.querySelector('.pier-temperature');

      observation.set({
        begin: new Date('2015-01-01 12:30:30'),
        pier_temperature: 35
      });

      // PhantomJS doesn't parse dates properly. This should work fine in
      // browser testing, and should be verified periodically. This should be
      // fixed in PhantomJS 2.0.x, but the grunt plugin needs to be updated.
      // expect(dateEl.value).to.equal('2015-01-01');
      // expect(julianEl.value).to.equal('1');
      expect(tempEl.value).to.equal('35');
    });
  });

});
