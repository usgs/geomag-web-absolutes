/* global chai, sinon, describe, it */
'use strict';

var Collection = require('mvc/Collection'),
    Measurement = require('geomag/Measurement'),
    Model = require('mvc/Model'),
    Reading = require('geomag/Reading');

var expect = chai.expect;


var meas1 = Measurement({'id': 1,'type': Measurement.FIRST_MARK_UP,
    'time': null,'angle':10.113, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0 });
var meas2 = Measurement({'id': 2,'type': Measurement.FIRST_MARK_DOWN,
    'time': null,'angle':190.105, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
var meas3 = Measurement({'id': 3,'type': Measurement.WEST_DOWN,
    'time': null,'angle':287, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
var meas4 = Measurement({'id': 4,'type': Measurement.EAST_DOWN,
    'time': null,'angle':99, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
var meas5 = Measurement({'id': 5,'type': Measurement.WEST_UP,
    'time': null,'angle':101, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
var meas6 = Measurement({'id': 6,'type': Measurement.EAST_UP,
    'time': null,'angle':286, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
var meas7 = Measurement({'id': 7,'type': Measurement.SECOND_MARK_UP,
    'time': null,'angle':10.113, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
var meas8 = Measurement({'id': 8,'type': Measurement.SECOND_MARK_DOWN,
    'time': null,'angle':190.105, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
var meas9 = Measurement({'id': 9,'type': Measurement.SOUTH_DOWN,
    'time': null,'angle':238, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
var measA = Measurement({'id': 10,'type': Measurement.NORTH_UP,
    'time': null,'angle':58, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
var measB = Measurement({'id': 11,'type': Measurement.SOUTH_UP,
    'time': null,'angle':118, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
var measC = Measurement({'id': 12,'type': Measurement.NORTH_DOWN,
    'time': null,'angle':297, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
var testmeasure = Measurement({'id': 14,'type': Measurement.NORTH_DOWN,
    'time': 10,'angle':297, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});

var TESTOBJECT = {
  'id': 1,
  'set_number': 1,
  'annotation': 'This is a test',
  'measurements': Collection([
    meas1, meas2, meas3, meas4, meas5, meas6,
    meas7, meas8, meas9, measA, measB, measC
  ]),
  startH: 1388772631000, endH: 1388772631000,
  absH: 18664.830905707, baseH: -2178.7015942929,
  startZ: 1388772631000, endZ: 1388772631000,
  absZ: 49034.335971417, baseZ: 1470.1409714166,
  startD: 1388772260000, endD: 1388772260000,
  absD: 169.78791666667, baseD: 169.82565118348
};

var TESTMEASUREMENTS = {
  FirstMarkUp:[meas1],
  FirstMarkDown:[meas2],
  WestDown:[meas3],
  EastDown:[meas4],
  WestUp:[meas5],
  EastUp:[meas6],
  SecondMarkUp:[meas7],
  SecondMarkDown:[meas8],
  SouthDown:[meas9],
  NorthUp:[measA],
  SouthUp:[measB],
  NorthDown:[measC]
};


describe('Unit tests for the "Reading" class', function () {

  describe('getMeasurements()',function () {

    //Note, the following code will add a measurement to TESTOBJECT.
    it('add a mesurement to underlying measurements collection', function(){
      var reading = Reading(TESTOBJECT);
      var measurements = reading.get('measurements');
      measurements.add(testmeasure);
      measurements = reading.get('measurements');
      var data = measurements.data();
      expect(data[data.length-1]).to.deep.equal(testmeasure);
    });

  });

  describe('eachMeasurement()', function () {

    it ('calls callback for each measurement', function () {
      var callback = sinon.spy(),
          reading = Reading(),
          measurements = reading.get('measurements').data(),
          m,
          mlen;

      reading.eachMeasurement(callback);
      // called once for each measurement
      expect(callback.callCount).to.equal(measurements.length);
      // called in the correct order
      for (m = 0, mlen = measurements.length; m < mlen; m++) {
        expect(callback.getCall(m).args[0]).to.equal(measurements[m]);
      }
    });

  });

});
