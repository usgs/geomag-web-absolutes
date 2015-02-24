/* global chai, sinon, describe, it */
'use strict';

var Observation = require('geomag/Observation');


var expect = chai.expect;

describe('Observation Unit Tests', function () {

  describe('eachReading()', function () {

    it ('calls callback for each reading', function () {
      var callback = sinon.spy(),
          observation = Observation(),
          readings = observation.get('readings').data(),
          r,
          rlen;

      observation.eachReading(callback);
      // called once for each measurement
      expect(callback.callCount).to.equal(readings.length);
      // called in the correct order
      for (r = 0, rlen = readings.length; r < rlen; r++) {
        expect(callback.getCall(r).args[0]).to.equal(readings[r]);
      }
    });

  });


  describe('eachMeasurement()', function () {

    it ('calls callback for each measurement', function () {
      var callback = sinon.spy(),
          observation = Observation(),
          readings = observation.get('readings').data(),
          reading,
          r,
          rlen,
          measurements,
          m,
          mlen,
          numMeasurements = 0;

      observation.eachMeasurement(callback);

      // called in the correct order
      for (r = 0, rlen = readings.length; r < rlen; r++) {
        reading = readings[r];
        measurements = reading.get('measurements').data();
        for (m = 0, mlen = measurements.length; m < mlen; m++) {
          expect(callback.getCall(numMeasurements++).args[0]).to.equal(measurements[m]);
        }
      }

      // called once for each measurement
      expect(callback.callCount).to.equal(numMeasurements);
    });

  });

}); // END :: Observation Unit Tests
