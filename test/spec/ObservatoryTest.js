/* global chai, describe, it */
'use strict';

var Collection = require('mvc/Collection'),
    Observatory = require('geomag/Observatory'),
    Util = require('util/Util');


var expect = chai.expect;


var TEST_OBSERVATORY_DATA = {
  'id': 'example_obs_001',
  'piers': Collection([
    {
      'id': 'test_pier_1'
    },
    {
      'id': 'test_pier_2'
    }
  ]),
  'default_pier_id': null
};


describe('Unit tests for the "Observatory" class', function () {

  describe('constructor()', function () {
    it('calls Model constructor', function () {
      var observatory = Observatory(TEST_OBSERVATORY_DATA);
      expect(observatory.get('id')).to.equal('example_obs_001');
    });
  });

  describe('getDefaultPier()', function () {
    it('returns the default pier when specified', function () {
      var observatory = Observatory(
          Util.extend({}, TEST_OBSERVATORY_DATA,
              {'default_pier_id': 'test_pier_1'}));
      var defaultPier = observatory.getDefaultPier();
      expect(defaultPier.id).to.equal('test_pier_1');
    });

    it('returns null when no default specified', function () {
      var observatory = Observatory(TEST_OBSERVATORY_DATA);
      var defaultPier = observatory.getDefaultPier();
      expect(defaultPier).to.equal(null);
    });
  });

});
