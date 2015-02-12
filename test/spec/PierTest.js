/* global define */
/* global describe */
/* global it */

define([
  'chai',
  'mvc/Collection',
  'mvc/Model',
  'util/Util',

  'geomag/Pier'
], function (
  chai,
  Collection,
  Model,
  Util,

  Pier
) {
  'use strict';
  var expect = chai.expect;


  var TEST_PIER_DATA = {
    'id': 'example_pier_001',
    'marks': new Collection([
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

    describe('constructor()', function () {

      it('is an instance of Model', function () {
        var myPier = new Pier(TEST_PIER_DATA);
        expect(myPier).to.be.instanceOf(Model);
      });

      it('is an instance of Pier', function () {
        var myPier = new Pier(TEST_PIER_DATA);
        expect(myPier).to.be.instanceOf(Pier);
      });

    });

    describe('getDefaultMark()', function () {

      it('returns the default mark when specified', function () {
        var myPier = new Pier(Util.extend({}, TEST_PIER_DATA,
            {'default_mark_id': 'test_mark_1'}));
        var defaultMark = myPier.getDefaultMark();
        expect(defaultMark.id).to.equal('test_mark_1');
      });

      it('returns null when no default specified', function () {
        var myPier = new Pier(TEST_PIER_DATA);
        var defaultMark = myPier.getDefaultMark();

        /* jshint expr : true */
        expect(defaultMark).to.be.null;
        /* jshint expr : false */
      });

    });  // END :: getDefaultMark

  });  // END :: Tests for Pier class

});
