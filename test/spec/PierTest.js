/* global chai, describe, it */
'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    Pier = require('geomag/Pier'),
    Util = require('util/Util');


var expect = chai.expect;


var TEST_PIER_DATA = {
  'id': 'example_pier_001',
  'marks': Collection([
    {
      'id': 'test_mark_1'
    },
    {
      'id': 'test_mark_2'
    },
    {
      'id': 'test_mark_3'
    }
  ]),
  'default_mark_id': null
};


describe('Unit tests for the "Pier" class', function () {

  describe('getDefaultMark()', function () {

    it('returns the default mark when specified', function () {
      var myPier = Pier(Util.extend({}, TEST_PIER_DATA,
          {'default_mark_id': 'test_mark_1'}));
      var defaultMark = myPier.getDefaultMark();
      expect(defaultMark.id).to.equal('test_mark_1');
    });

    it('returns null when no default specified', function () {
      var myPier = Pier(TEST_PIER_DATA);
      var defaultMark = myPier.getDefaultMark();

      /* jshint expr : true */
      expect(defaultMark).to.be.null;
      /* jshint expr : false */
    });

  });  // END :: getDefaultMark

});  // END :: Tests for Pier class
