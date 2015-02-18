/* global chai, sinon, describe, it, before, after */
'use strict';

var ObservationsView = require('geomag/ObservationsView'),
    observatory1 = require('./observatory1'),
    Util = require('util/Util'),
    Xhr = require('util/Xhr');


var expect = chai.expect;
var DEFAULTS = {
  observatoryId: 1
};
var stub;
var observationsView;

describe('Observations Unit Tests', function () {

  before(function () {
    stub = sinon.stub(Xhr, 'ajax', function (options) {
      options.success(observatory1);
    });

    observationsView = new ObservationsView(DEFAULTS);
  });

  after(function() {
    stub.restore();
  });

  describe('Constructor', function () {

    it('Can be defined', function () {
      /* jshint -W030 */
      expect(observationsView).to.not.be.undefined;
      /* jshint +W030 */
    });

    it('Can be instantiated', function () {
      expect(observationsView).to.be.an.instanceOf(ObservationsView);
    });

  });

  describe('Observations', function () {

    it('can add a new observation button', function () {
      var el = observationsView._el.querySelector('.observations-new'),
          button = el.querySelector('.button');
      /* jshint -W030 */
      expect(button).to.not.be.undefined;
      /* jshint +W030 */
    });

    it('can get all existing observations', function () {
      var el = observationsView._el.querySelector('.observations-all'),
          observations = el.querySelectorAll('li');
      expect(observations.length).to.equal(11);
    });

  });
});
