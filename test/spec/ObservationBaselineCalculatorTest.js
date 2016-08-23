/* global chai, describe, it */
'use strict';

var BaselineCalculator = require('geomag/BaselineCalculator'),
    Collection = require('mvc/Collection'),
    Measurement = require('geomag/Measurement'),
    Calculator = require('geomag/ObservationBaselineCalculator'),
    Reading = require('geomag/Reading');


var expect = chai.expect;

// data from BOU, at the time of BOU20132861836.bns
var calc = Calculator({
    calculator: BaselineCalculator(),
    pierCorrection: -23.1,
    trueAzimuthOfMark: 199.1383
});

// data from BSL, at the time of BSL2016106142821.bns
var calc2 = Calculator({
    calculator: BaselineCalculator(),
    pierCorrection: -4.2,
    trueAzimuthOfMark: 176.6458
});

// data from BOU20132861836.bns
var meas1 = Measurement({
    'id': 1,
    'type': Measurement.FIRST_MARK_UP,
    'time': null,
    'angle': 10.332222222222223,// 10.3322, // 10,19,56
    'h': 20000.8,
    'e': -300.8,
    'z': 45000.8,
    'f': 55000.6
});

// data from BSL20161061428.bns
var meas10 = Measurement({
    'id': 1,
    'type': Measurement.FIRST_MARK_UP,
    'time': null,
    'angle': 18.8,// 18.8, // 18,48,00
    'h': 0,
    'e': 0,
    'z': 0,
    'f': 0
});

// data from BOU20132861836.bns
var meas2 = Measurement({
    'id': 2,
    'type': Measurement.FIRST_MARK_DOWN,
    'time': null,
    'angle': 190.3363888888889,// 190.3364, // 190 20 11
    'h': 20000.7,
    'e': -300.7,
    'z': 45000.7,
    'f': 55000.5
});

// data from BSL20161061428.bns
var meas20 = Measurement({
    'id': 2,
    'type': Measurement.FIRST_MARK_DOWN,
    'time': null,
    'angle': 198.81,// 198.81, // 18,48,36
    'h': 0,
    'e': 0,
    'z': 0,
    'f': 0
});

// data from BOU20132861836.bns
var meas3 = Measurement({'id': 3,
    'type': Measurement.WEST_DOWN,
    'time': 183639,
    'angle': 270.15749999999997,// 270.1575, // 270 9 27
    'h': 20000.6,
    'e': -269.88,
    'z': 45000.6,
    'f': 55000.4
});

// data from BSL20161061428.bns
var meas30 = Measurement({'id': 3,
    'type': Measurement.WEST_DOWN,
    'time': 142821,
    'angle': 291.22666666666667,// 291.2267, // 291 13.6
    'h': 23288.46,
    'e': -61.85,
    'z': 41030.67,
    'f': 47581.70
});

// data from BOU20132861836.bns
var meas4 = Measurement({
    'id': 4,
    'type': Measurement.EAST_DOWN,
    'time': 183733,
    'angle': 90.22194444444445,// 90.2219, // 90 13 19
    'h': 20000.5,
    'e': -270.13,
    'z': 45000.5,
    'f': 55000.3
});

// data from BSL20161061428.bns
var meas40 = Measurement({
    'id': 4,
    'type': Measurement.EAST_DOWN,
    'time': 142947,
    'angle': 111.4,// 111.4, // 111 24 0
    'h': 23288.94,
    'e': -62.14,
    'z': 41030.09,
    'f': 47581.43
});


// data from BOU20132861836.bns
var meas5 = Measurement({
    'id': 5,
    'type': Measurement.WEST_UP,
    'time': 183820,
    'angle': 90.2936111111111,// 90.2936, // 90 17 37
    'h': 20000.4,
    'e': -269.38,
    'z': 45000.4,
    'f': 55000.2
});

// data from BSL20161061428.bns
var meas50 = Measurement({
    'id': 5,
    'type': Measurement.WEST_UP,
    'time': 143041,
    'angle': 111.39,// 111.39, // 111 23 24
    'h': 23289.28,
    'e': -62.38,
    'z': 41029.79,
    'f': 47581.31
});

// data from BOU20132861836.bns
var meas6 = Measurement({
    'id': 6,
    'type': Measurement.EAST_UP,
    'time': 183916,
    'angle': 270.2547222222222,// 270.2547, // 270 15 17
    'h': 20000.3,
    'e': -269.37,
    'z': 45000.3,
    'f': 55000.1
});

// data from BSL20161061428.bns
var meas60 = Measurement({
    'id': 6,
    'type': Measurement.EAST_UP,
    'time': 143151,
    'angle': 291.236666666667,// 291.2367, // 291 14 12
    'h': 23289.75,
    'e': -63.21,
    'z': 41029.35,
    'f': 55000.1
});

// data from BOU20132861836.bns
var meas7 = Measurement({
    'id': 7,
    'type': Measurement.SECOND_MARK_UP,
    'time': null,
    'angle': 10.330555555555556,// 10.3306, // 10 19 50
    'h': 20000.2,
    'e': -300.6,
    'z': 45000.2,
    'f': 55000.0
});

// data from BSL20161061428.bns
var meas70 = Measurement({
    'id': 7,
    'type': Measurement.SECOND_MARK_UP,
    'time': null,
    'angle': 18.8,// 18.8, // 18 48 0
    'h': 0,
    'e': 0,
    'z': 0,
    'f': 0
});

// data from BOU20132861836.bns
var meas8 = Measurement({
    'id': 8,
    'type': Measurement.SECOND_MARK_DOWN,
    'time': null,
    'angle': 190.33972222222224,// 190.3369, // 190 20 23
    'h': 20000.1,
    'e': -300.5,
    'z': 45000.1,
    'f': 55000.9
});

// data from BSL20161061428.bns
var meas80 = Measurement({
    'id': 8,
    'type': Measurement.SECOND_MARK_DOWN,
    'time': null,
    'angle': 198.81,// 198.81, // 198 48 36
    'h': 0,
    'e': 0,
    'z': 0,
    'f': 0
});

// data from BOU20132861836.bns
var meas9 = Measurement({
    'id': 9,
    'type': Measurement.SOUTH_DOWN,
    'time': 184200,
    'angle': 246.67388888888888,// 246.6739, // 246 40 26
    'h': 20821.17,
    'e': -300.4,
    'z': 47753.38,
    'f': 52628.85
});

// data from BSL20161061428.bns
var meas90 = Measurement({
    'id': 9,
    'type': Measurement.SOUTH_DOWN,
    'time': 184200,
    'angle': 239.84833333333333,// 239.8483, // 239 50 54
    'h': 23290.9,
    'e': -64.98,
    'z': 41028.43,
    'f': 47580.94
});

// data from BOU20132861836.bns
var measA = Measurement({
    'id': 10,
    'type': Measurement.NORTH_UP,
    'time': 184247,
    'angle': 66.66916666666667,// 66.6692, // 66 40 9
    'h': 20821.50,
    'e': -300.3,
    'z': 47753.70,
    'f': 52629.24
});

// data from BSL20161061428.bns
var measA0 = Measurement({
    'id': 10,
    'type': Measurement.NORTH_UP,
    'time': 143601,
    'angle': 59.843333333333333,// 59.8433, // 59 50 36
    'h': 23290.97,
    'e': -64.76,
    'z': 41027.92,
    'f': 47580.54
});

// data from BOU20132861836.bns
var measB = Measurement({
    'id': 11,
    'type': Measurement.SOUTH_UP,
    'time': 184347,
    'angle': 113.34722222222221,// 113.3472, // 113 20 50
    'h': 20821.03,
    'e': -300.2,
    'z': 47753.68,
    'f': 52629.07
});

// data from BSL20161061428.bns
var measB0 = Measurement({
    'id': 11,
    'type': Measurement.SOUTH_UP,
    'time': 143722,
    'angle': 120.24,// 120.24, // 120 14 24
    'h': 23290.72,
    'e': -64.46,
    'z': 41027.5,
    'f': 47580.07
});

// data from BOU20132861836.bns
var measC = Measurement({
    'id': 12,
    'type': Measurement.NORTH_DOWN,
    'time': 184513,
    'angle': 293.35361111111115,// 293.3536, // 293 21 13
    'h': 20820.68,
    'e': -300.1,
    'z': 47754.02,
    'f': 52629.28
});

// data from BSL20161061428.bns
var measC0 = Measurement({
    'id': 12,
    'type': Measurement.NORTH_DOWN,
    'time': 143938,
    'angle': 300.24666666666667,// 300.2467, // 300 14 48
    'h': 23289.9,
    'e': -64.28,
    'z': 41026.81,
    'f': 47579.07
});

// data from BOU20132861836.bns
var READING = Reading({
  'id': 1,
  'set_number': 1,
  'declination_valid': true,
  'horizontal_intensity_valid': true,
  'vertical_intensity_valid': true,
  'observer': 'Eddie',
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
});

// data from BSL20161061428.bns
var READING0 = Reading({
  'id': 1,
  'set_number': 1,
  'declination_valid': true,
  'horizontal_intensity_valid': true,
  'vertical_intensity_valid': true,
  'observer': 'taylor',
  'annotation': 'Corrected 7/28/2016 TLP',
  'measurements': Collection([
    meas10, meas20, meas30, meas40, meas50, meas60,
    meas70, meas80, meas90, measA0, measB0, measC0
  ]),
  startH: 1460733175000, endH: 1460733175000,
  absH: 23930.7572684, baseH: 640.1347684,
  startZ: 1460733175000, endZ: 1460733175000,
  absZ: 41119.2211833, baseZ: 91.5561833,
  startD: 1460733175000, endD: 1460733175000,
  absD: -0.8408667, baseD: -0.6914786
});


describe('Unit tests for ObservationBaselineCalculator', function () {

  // --------------------------------------------------------------
  // Tests for API methods
  // --------------------------------------------------------------

  describe('magneticSouthMeridian()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      expect(calc.magneticSouthMeridian(READING))
          .to.be.closeTo(180.2319, 0.001);
    });

  }); // END :: magneticSouthMeridian

  describe('magneticSouthMeridian()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      expect(calc2.magneticSouthMeridian(READING0))
          .to.be.closeTo(201.3133, 0.001);
    });

  }); // END :: magneticSouthMeridian

  describe('magneticAzimuthMark()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      expect(calc.magneticAzimuthMark(READING)).to.be.closeTo(10.1021, 0.01);
    });

  }); // END :: magneticAzimuthMark

  describe('magneticAzimuthMark()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      expect(calc2.magneticAzimuthMark(READING0)).to.be.closeTo(-2.5083, 0.01);
    });

  }); // END :: magneticAzimuthMark

  describe('geographicMeridian()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      expect(calc.geographicMeridian(READING))
          .to.be.closeTo(-188.8036, 0.001);   // -188.8069
    });

  }); // END :: geographicMeridian

  describe('geographicMeridian()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      expect(calc2.geographicMeridian(READING0))
          .to.be.closeTo(-157.8408, 0.001);   // -18.8036?
    });

  }); // END :: geographicMeridian

  describe('magneticDeclination()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      expect(calc.magneticDeclination(READING)).to.be.closeTo(9.0362, 0.01);
    });

  }); // END ::  magneticDeclination

  describe('magneticDeclination()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      expect(calc2.magneticDeclination(READING0)).to.be.closeTo(-0.8459, 0.01);
    });

  }); // END ::  magneticDeclination

  describe('westUpMinusEastDown()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      var expected = 0.07166666666666667;   // 4.3' converted to degrees
      expect(calc.westUpMinusEastDown(READING))
          .to.be.closeTo(expected, 0.0001);
    });

  }); // END ::  westUpMinusEastDown

  describe('westUpMinusEastDown()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      var expected = -0.01;   // -0.6' converted to degrees
      expect(calc2.westUpMinusEastDown(READING0))
          .to.be.closeTo(expected, 0.0001);
    });

  }); // END ::  westUpMinusEastDown

  describe('eastUpMinusWestDown()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      var expected = 0.09716666666666667;    // 5.83 converted to degrees
      expect(calc.eastUpMinusWestDown(READING))
          .to.be.closeTo(expected, 0.0001);
    });

  }); // END :: e

  describe('eastUpMinusWestDown()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      var expected = 0.01;    // 0.6' converted to degrees
      expect(calc2.eastUpMinusWestDown(READING0))
          .to.be.closeTo(expected, 0.0001);
    });

  }); // END :: e

  describe('fCorrected()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      expect(calc.fCorrected(READING)).to.be.closeTo(52606.01, 0.00001);
    });

  }); // END :: corrected F

  describe('fCorrected()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      expect(calc2.fCorrected(READING0)).to.be.closeTo(47575.955, 0.00001);
    });

  }); // END :: corrected F

  describe('inclination()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      expect(calc.inclination(READING)).to.be.closeTo(66.6606, 0.001);
    });

  }); // END :: inclination

  describe('inclination()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      expect(calc2.inclination(READING0)).to.be.closeTo(59.8013, 0.001);
    });

  }); // END :: inclination

  describe('horizontalComponent()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      expect(calc.horizontalComponent(READING))
          .to.be.closeTo(20841.33, 0.01);
    });

  }); // END :: horiztonal Component

  describe('horizontalComponent()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      expect(calc2.horizontalComponent(READING0))
          .to.be.closeTo(23930.757, 0.01);
    });

  }); // END :: horiztonal Component

  describe('verticalComponent()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      expect(calc.verticalComponent(READING)).to.be.closeTo(48301.46, 0.01);
    });

  }); // END :: verticalComponent

  describe('verticalComponent()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      expect(calc2.verticalComponent(READING0)).to.be.closeTo(41119.23, 0.01);
    });

  }); // END :: verticalComponent

  describe('southDownMinusNorthUp()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      var expected = 0.0046666;    // 0 0.28 converted to degrees
      expect(calc.southDownMinusNorthUp(READING))
          .to.be.closeTo(expected, 0.0001);
    });

  }); // END :: s

  describe('southDownMinusNorthUp()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      var expected = 0.005;    // 0.3' converted to degrees
      expect(calc2.southDownMinusNorthUp(READING0))
          .to.be.closeTo(expected, 0.0001);
    });

  }); // END :: s

  describe('northDownMinusSouthUp()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      var expected = 0.0063333;    //  0 0.38 converted to degrees
      expect(calc.northDownMinusSouthUp(READING))
          .to.be.closeTo(expected, 0.0001);
    });

  }); // END :: northDownMinusSouthUp

  describe('northDownMinusSouthUp()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      var expected = 0.0066667;    //  0.4' converted to degrees
      expect(calc2.northDownMinusSouthUp(READING0))
          .to.be.closeTo(expected, 0.0001);
    });

  }); // END :: northDownMinusSouthUp

  describe('scaleValue()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      var expected = 0.16494853255526;   // 0.16494853255526
      expect(calc.scaleValue(READING)).to.be.closeTo(expected, 0.01);
    });

  }); // END :: scaleValue

  describe('scaleValue()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      var expected = 0.1437;   // 0.16494853255526
      expect(calc2.scaleValue(READING0)).to.be.closeTo(expected, 0.01);
    });

  }); // END :: scaleValue

  describe('dComputed()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      var expected = -0.7413333333333333;// 464.5604 min, convert to degrees
      expect(calc.dComputed(READING)).to.be.closeTo(expected, 0.0001);
    });

  }); // END :: dComputed

  describe('dComputed()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      var expected = -0.1493833333333333;// -8.963 min, convert to degrees
      expect(calc2.dComputed(READING0)).to.be.closeTo(expected, 0.0001);
    });

  }); // END :: dComputed

  describe('dBaseline()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      // 9.780333333333335
      var expected = 9.7769;  // 586.66 min, converted to degrees
      expect(calc.dBaseline(READING)).to.be.closeTo(expected, 0.0001);
    });

  }); // END :: dBaseline

  describe('dBaseline()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {

      var expected = -0.6965;  // -41.79 min, converted to degrees
      expect(calc2.dBaseline(READING0)).to.be.closeTo(expected, 0.0001);
    });

  }); // END :: dBaseline

  describe('hBaseline()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      expect(calc.hBaseline(READING)).to.be.closeTo(20.23, 0.01);
    });

  }); // END :: hBaseline

  describe('hBaseline()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      expect(calc2.hBaseline(READING0)).to.be.closeTo(640.135, 0.01);
    });

  }); // END :: hBaseline

  describe('zBaseline()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      expect(calc.zBaseline(READING)).to.be.closeTo(547.76, 0.01);
    });

  }); // END :: zBaseline

  describe('zBaseline()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      expect(calc2.zBaseline(READING0)).to.be.closeTo(91.556, 0.01);
    });

  }); // END :: zBaseline

  describe('eBaseline()', function () {

    it('computes correctly with data from BOU20132861836.bns', function () {
      var expected = 3556.3593;   // 3556.6245477416474
      expect(calc.eBaseline(READING)).to.be.closeTo(expected, 0.1);
    });

  }); // END :: eBaseline

  describe('eBaseline()', function () {

    it('computes correctly with data from BSL20161061428.bns', function () {
      var expected = -290.91;   // -288.810
      expect(calc2.eBaseline(READING0)).to.be.closeTo(expected, 0.1);
    });

  }); // END :: eBaseline

  describe('get stats', function () {
    it('computes correctly 1,1,1,1', function () {
      var input = [1,1,1,1],
          stats = calc.getStats(input);

      expect(stats.mean).to.equal(1);
      expect(stats.min).to.equal(1);
      expect(stats.max).to.equal(1);
      expect(stats.stdDev).to.equal(0);
    });

    it('computes correctly 1,2,3,4', function () {
      var input = [1,2,3,4],
          stats = calc.getStats(input);

      expect(stats.mean).to.equal(2.5);
      expect(stats.min).to.equal(1);
      expect(stats.max).to.equal(4);
      expect(stats.stdDev).to.be.closeTo(1.118,0.0001);
    });

    it('computes correctly 10,26,37,108', function () {
      var input = [10,26,37,108],
          stats = calc.getStats(input);

      expect(stats.mean).to.equal(45.25);
      expect(stats.min).to.equal(10);
      expect(stats.max).to.equal(108);
      expect(stats.stdDev).to.be.closeTo(37.479,0.001);
    });
  });
}); // END :: Unit tests for BaselineCalculator
