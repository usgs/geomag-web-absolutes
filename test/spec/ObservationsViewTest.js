/* global chai, sinon, describe, it, before, after */
'use strict';

var ObservationsView = require('geomag/ObservationsView'),
    observatory1 = require('./observatory1'),
    Xhr = require('util/Xhr');


var expect = chai.expect;
var DEFAULTS = {
  observatoryId: 1
};
var stub;
var observationsView;

describe('ObservationsView Unit Tests', function () {

  before(function () {
    stub = sinon.stub(Xhr, 'ajax', function (options) {
      options.success(observatory1);
    });

    observationsView = ObservationsView(DEFAULTS);
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

  });

  describe('Observations', function () {

    it('can add a new observation button', function () {
      var el = observationsView.el.querySelector('.observations-new'),
          button = el.querySelector('.button');
      /* jshint -W030 */
      expect(button).to.not.be.undefined;
      /* jshint +W030 */
    });

    it('can get all existing observations', function () {
      var el = observationsView.el.querySelector('.observations-all'),
          observations = el.querySelectorAll('li');
      expect(observations.length).to.equal(11);
    });

  });
});
