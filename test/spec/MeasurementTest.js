/* global chai, describe, it */
'use strict';

var Measurement = require('geomag/Measurement');


var expect = chai.expect;

describe('Unit tests for the "Measurement" class', function () {
  var testObject = {
    'id': 1,
    'type': 'WestUp',
    'time': 1377011991,
    'angle': 0.0,
    'h': 20881.1,
    'e': 36.579,
    'z': 47623.3,
    'f': 52530.7
  };
  describe('constructor()', function () {
    it('evaluates to instanceof "Measurement"', function () {
      var measurement = Measurement();
      expect(measurement).to.be.an.instanceOf(Measurement);
    });

    it('works when passed a test object', function () {
      var measurement = Measurement(testObject);
      expect(measurement.get('id')).to.equal(testObject.id);
      expect(measurement.get('type')).to.equal(testObject.type);
      expect(measurement.get('time')).to.equal(testObject.time);
      expect(measurement.get('angle')).to.equal(testObject.angle);
      expect(measurement.get('h')).to.equal(testObject.h);
      expect(measurement.get('e')).to.equal(testObject.e);
      expect(measurement.get('z')).to.equal(testObject.z);
      expect(measurement.get('f')).to.equal(testObject.f);
    });
  });
});
