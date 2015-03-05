/* global chai, sinon, describe, it, before, after */
'use strict';

var observatories = require('./observatories'),
    observatory1 = require('./observatory1'),
    ObservatoryView = require('geomag/ObservatoryView'),
    User = require('geomag/User'),
    Xhr = require('util/Xhr');


var expect = chai.expect;

var stub;

var DEFAULTS = {
  observatoryId: null,
  user: User({
    admin: 'Y',
    enabled: 'Y',
    username: 'test'
  })
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
      var url = options.url;

      if (url === '/observatory_summary_feed.php') {
        options.success(observatories);
      } else if (url === '/observatory_detail_feed.php') {
        options.success(observatory1);
      }
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

  });


  describe('Event bindings', function () {

    it('can get all observatories', function () {
      var all = observatoryView.el.querySelector('.observatories');
          observatories = all.querySelectorAll('option');
      expect(observatories.length).to.equal(15);
    });

    it('can generate a hash change onClick', function () {
      var select = observatoryView.el.querySelector('.observatories'),
          hashBefore = window.location.hash,
          hashAfter = hashBefore;

      // change value and dispatch event, should update hash
      select.value = '1';
      select.dispatchEvent(getChangeEvent());

      hashAfter = window.location.hash;

      expect(hashBefore).to.not.equal(hashAfter);
    });

  });

});
