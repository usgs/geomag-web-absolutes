/* global chai, describe, it */
'use strict';

var RealtimeData = require('geomag/RealtimeData');


var expect = chai.expect;

// /map/observatories_data.json.php?starttime=1392826001&endtime=1392826005&chan[]=H&chan[]=E&chan[]=Z&chan[]=F&freq=seconds&obs[]=BOU&obs[]=BRW
var TESTDATA = {
  'request':{
    'starttime':1392826001,
    'endtime':1392826005
  },
  'times':[
    1392826001,1392826002,1392826003,1392826004,1392826005
  ],
  'data':[
    {
      'id':'BOU',
      'nominals':{
        'H':20870,
        'E':55.91,
        'Z':47800,
        'F':52799
      },
      'values':{
        'H':[20859.1,20859.1,20859.2,20859.2,20859.2],
        'E':[10.328,10.282,10.252,10.238,10.205],
        'Z':[47546.6,47546.6,47546.6,47546.6,47546.6],
        'F':[52456.4,52456.5,52456.5,52456.4,52456.5]
      }
    },
    {
      'id':'BRW',
      'nominals':{
        'H':9200,
        'E':48.24,
        'Z':56900,
        'F':57461
      },
      'values':{
        'H':[9204.86,9204.77,9204.66,9204.53,9204.37],
        'E':[-256.197,-256.113,-256.003,-255.876,-255.74],
        'Z':[56937.2,56937.2,56937.2,56937.2,56937.2],
        'F':[57525,57525,57525,57524.9,57524.9]
      }
    }
  ]
};


describe('Unit tests for the "RealtimeData" class', function () {

  var realtimeData = RealtimeData(TESTDATA);

  describe('getStarttime()', function () {
    it('returns the first time', function () {
      expect(realtimeData.getStarttime()).to.equal(1392826001);
    });
  });

  describe('getEndtime()', function () {
    it('returns the last time', function () {
      expect(realtimeData.getEndtime()).to.equal(1392826005);
    });
  });

  describe('getValues()', function () {
    it('retrieves data from the specified observatory', function () {
      var values = realtimeData.getValues(1392826002345, 'BRW');
      expect(values).to.deep.equal({
        H:9204.77,
        E:-256.113,
        Z:56937.2,
        F:57525
      });
    });

    it('defaults to the first observatory', function () {
      var values = realtimeData.getValues(1392826002345);
      expect(values).to.deep.equal({
        H:20859.1,
        E:10.282,
        Z:47546.6,
        F:52456.5
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
