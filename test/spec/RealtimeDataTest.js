/* global chai, describe, it */
'use strict';

var RealtimeData = require('geomag/RealtimeData');


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

describe('Unit tests for the "RealtimeData" class', function () {

  var realtimeData = RealtimeData(TESTDATA);

  describe('getStarttime()', function () {
    it('returns the first time', function () {
      expect(realtimeData.getStarttime()).to.equal('2016-11-14T16:44:20.000Z');
    });
  });

  describe('getEndtime()', function () {
    it('returns the last time', function () {
      expect(realtimeData.getEndtime()).to.equal('2016-11-14T16:44:24.000Z');
    });
  });

  describe('getValues()', function () {
    it('retrieves data from the specified observatory', function () {
      var values = realtimeData.getValues('2016-11-14T16:44:21.000Z');
      expect(values).to.deep.equal({
        H:20821.497,
        E:-119.689,
        Z:47228.824,
        F:52150.63
      });
    });

    it('defaults to the first observatory', function () {
      var values = realtimeData.getValues('2016-11-14T16:44:22.000Z');
      expect(values).to.deep.equal({
        H:20821.52,
        E:-119.653,
        Z:47228.83,
        F:52150.66
      });
    });

    it('returns null if the time is out of range', function () {
      expect(realtimeData.getValues(1392826000000)).to.equal(null);
      expect(realtimeData.getValues(1392826006000)).to.equal(null);
    });

    it('returns null if the observatory is not present', function () {
      expect(realtimeData.getValues(1392826002345, 'BSL')).to.equal(null);
    });

  });

});
