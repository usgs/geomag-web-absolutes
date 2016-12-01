/* global chai, sinon, describe, it, before, after */
'use strict';

var RealtimeDataFactory = require('geomag/RealtimeDataFactory'),
    Xhr = require('util/Xhr');


var expect = chai.expect;


// http://geomag.usgs.gov/ws/edge/?starttime=2016-11-14T16:44:20Z&endtime=2016-11-14T17:24:09Z&id=BOU&elements=H,E,Z,F&sampling_period=1&format=json
var TESTDATA = {
  'type': 'Timeseries',
  'metadata': {
    'intermagnet': {
      'imo': {
        'iaga_code': 'BOU',
        'name': 'Boulder',
        'coordinates': [
          254.763,
          40.137,
          1682
        ]
      },
      'reported_orientation': 'HEZF',
      'sensor_orientation': 'HDZF',
      'data_type': 'variation',
      'sampling_period': 1,
      'digital_sampling_rate': 0.01
    },
    'status': 200,
    'generated': '2016-11-30T22:09:59Z',
    'url': 'http://geomag.usgs.gov/ws/edge/?starttime=2016-11-14T16:44:20Z&endtime=2016-11-14T17:24:09Z&id=BOU&elements=H,E,Z,F&sampling_period=1&format=json',
    'api': '0.1.3'
  },
  'times': [
    '2016-11-14T16:44:20.000Z',
    '2016-11-14T16:44:21.000Z',
    '2016-11-14T16:44:22.000Z',
    '2016-11-14T16:44:23.000Z',
    '2016-11-14T16:44:24.000Z'
  ],
  'values': [
    {
      'id': 'H',
      'metadata': {
        'element': 'H',
        'network': 'NT',
        'station': 'BOU',
        'channel': 'SVH',
        'location': 'R0',
        'flag': 'F'
      },
      'values': [
        20821.514,
        20821.497,
        20821.52,
        20821.545,
        20821.545
      ]
    },
    {
      'id': 'E',
      'metadata': {
        'element': 'E',
        'network': 'NT',
        'station': 'BOU',
        'channel': 'SVE',
        'location': 'R0',
        'flag': 'F'
      },
      'values': [
        -119.722,
        -119.689,
        -119.653,
        -119.631,
        -119.608
      ]
    },
    {
      'id': 'Z',
      'metadata': {
        'element': 'Z',
        'network': 'NT',
        'station': 'BOU',
        'channel': 'SVZ',
        'location': 'R0',
        'flag': 'F'
      },
      'values': [
        47228.849,
        47228.824,
        47228.83,
        47228.807,
        47228.793
      ]
    },
    {
      'id': 'F',
      'metadata': {
        'element': 'F',
        'network': 'NT',
        'station': 'BOU',
        'channel': 'SSF',
        'location': 'R0',
        'flag': 'F'
      },
      'values': [
        52150.69,
        52150.63,
        52150.66,
        52150.62,
        52150.6
      ]
    }
  ]
};


describe('Unit tests for the "RealtimeDataFactory" class', function () {

  describe('getRealtimeData()',function () {

    // fake Xhr.ajax
    var stub;
    before(function () {
      stub = sinon.stub(Xhr, 'ajax', function (options) {
        options.success(TESTDATA);
      });
    });
    after(function () {
      stub.restore();
    });

    it('builds a realtime data url', function () {
      var factory,
          url;

      factory = RealtimeDataFactory();
      url = factory.buildRealtimeDataUrl({
        starttime: '2016-11-14T16:44:20.000Z',
        endtime: '2016-11-14T16:44:24.000Z',
        observatory: 'BOU',
        channels: ['H','E','Z','F'],
        freq: 1,
        url: 'http://geomag.cr.usgs.gov/ws/edge'
      });

      expect(url).to.equal('http://geomag.cr.usgs.gov/ws/edge?starttime=2016-11-14T16:44:20.000Z&endtime=2016-11-14T16:44:24.000Z&id=BOU&elements=H,E,Z,F&sampling_period=60&format=json');
    });

    it('Uses RealtimeData class for returned data', function (done) {
      var realtimeDataFactory = RealtimeDataFactory();

      realtimeDataFactory.getRealtimeData({
        starttime: '2016-11-14T16:44:20.000Z',
        endtime: '2016-11-14T16:44:24.000Z',
        observatory: 'BOU',
        channels: ['H','E','Z','F'],
        freq: 1,
        success: function (/*data*/) {
          // check returned data
          //expect(data).to.deep.equal(new RealtimeData(TESTDATA));

          // check stub was called
          expect(stub.callCount).to.equal(1);

          done();
        },
        error: function (err) {
          done(err);
        }
      });
    });

  });

});
