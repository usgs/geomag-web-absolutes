/* global chai, sinon, describe, it, before, after */
'use strict';

var observatories = require('./observatories'),
    ObservatoryView = require('geomag/ObservatoryView'),
    Xhr = require('util/Xhr');


var expect = chai.expect;

var stub;

var DEFAULTS = {
  observatoryId: null
};

var observatoryView;

var getChangeEvent = function () {
  var changeEvent = document.createEvent('HTMLEvents');
  changeEvent.initEvent('change', true, true, window, 1, 0, 0);
  return changeEvent;
};

describe('ObservatoryView Unit Tests', function () {

  before(function () {
    stub = sinon.stub(Xhr, 'ajax', function (options) {
      options.success(observatories);
    });

    observatoryView = ObservatoryView(DEFAULTS);
  });

  after(function() {
    window.location.hash = '';
    stub.restore();
  });


  describe('Observatory details', function () {

    it('can get all observatories', function () {
      var all = observatoryView.el.querySelector('.observatories');
          observatories = all.querySelectorAll('option');
      expect(observatories.length).to.equal(15);
    });

    it('can select an observatory by default', function () {
      var all = observatoryView.el.querySelector('.observatories'),
          selected = all.value;
      expect(selected).to.equal('observatory_2');
    });

  });


  describe('Event bindings', function () {

    it('can select a default observatory', function () {
      var container = observatoryView.el,
          select = container.querySelector('.observatories'),
          option = container.querySelector('#observatory_2');
      expect(option.value).to.equal(select.value);
    });

    it('can generate a hash change onClick', function () {
      var select = observatoryView.el.querySelector('.observatories'),
          hashBefore = window.location.hash,
          hashAfter = hashBefore;

      // change value and dispatch event, should update hash
      select.value = 'observatory_1';
      select.dispatchEvent(getChangeEvent());

      hashAfter = window.location.hash;

      expect(hashBefore).to.not.equal(hashAfter);
      expect(hashAfter).to.equal('#1');
    });

  });

});
