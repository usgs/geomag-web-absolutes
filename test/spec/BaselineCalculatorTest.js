/* global chai, describe, it */
'use strict';

var BaselineCalculator = require('geomag/BaselineCalculator');


var expect = chai.expect,
    calc = BaselineCalculator();

describe('Unit tests for BaselineCalculator', function () {

  // --------------------------------------------------------------
  // Tests for helper methods
  // --------------------------------------------------------------

  describe('mean()', function () {

    it('returns NaN when no values are given', function () {
      expect(isNaN(calc.mean())).to.equal(true);
    });

    it('works with a single value', function () {
      expect(calc.mean(42)).to.equal(42);
      expect(calc.mean(9.2)).to.equal(9.2);
    });

    it('works with several values', function () {
      expect(calc.mean(1, 2, 3, 4, 5)).to.equal(3);
      expect(calc.mean(0.0, 0.5, 1.0, 1.5, 2.0)).to.equal(1.0);
    });

    it('works when some non-numeric values are given', function () {
      expect(calc.mean(1, 2, 3, 'hello', 4, 5)).to.equal(3);
      expect(calc.mean(0.0, 0.5, 'goodbye', 1.0, 1.5, 2.0)).to.equal(1.0);
    });

    it('works when some number-ish strings are given', function () {
      expect(calc.mean(1, 2, 3, '5000', 4, 5)).to.equal(3);
      expect(calc.mean(0.0, 0.5, '999.9', 1.0, 1.5, 2.0)).to.equal(1.0);
    });

  }); // END :: _mean

  describe('_toRadians()', function () {

    it('converts correctly', function () {
      // Positive degrees
      expect(calc._toRadians(0.0)).to.equal(0.0);
      expect(calc._toRadians(45.0)).to.equal(Math.PI/4);
      expect(calc._toRadians(90.0)).to.equal(Math.PI/2);
      expect(calc._toRadians(135.0)).to.equal(3*Math.PI/4);
      expect(calc._toRadians(180.0)).to.equal(Math.PI);

      // Negative degrees
      expect(calc._toRadians(-0.0)).to.equal(-0.0);
      expect(calc._toRadians(-45.0)).to.equal(-1*Math.PI/4);
      expect(calc._toRadians(-90.0)).to.equal(-1*Math.PI/2);
      expect(calc._toRadians(-135.0)).to.equal(-3*Math.PI/4);
      expect(calc._toRadians(-180.0)).to.equal(-1*Math.PI);
    });

  }); // END :: _toRadians

  // --------------------------------------------------------------
  // Tests for API methods
  // --------------------------------------------------------------

  describe('magneticSouthMeridian()', function () {

    it('computes correctly', function () {
      var westDown = 1.0,
          westUp = 2.0,
          eastDown = 3.0,
          eastUp = 4.0,
          expected = 2.5;

      expect(calc.magneticSouthMeridian(
          westDown, westUp, eastDown, eastUp)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var westDown = 270.3533,  // 270 21.2
          westUp = 90.4750,     //  90 28.5
          eastDown = 90.5050,   //  90 30.3
          eastUp = 270.3833,    // 270 23.0
          expected = 180.42915; // 180.4292

      expect(calc.magneticSouthMeridian(westDown, westUp,
          eastDown, eastUp)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var westDown = 272.3111,  // 272 18 40
          westUp = 92.1722,     //  92 10 20
          eastDown = 92.1181,   //  92 07 05
          eastUp = 272.4400,    // 272 26 24
          expected = 182.26035; // 182.2603

      expect(calc.magneticSouthMeridian(westDown, westUp,
          eastDown, eastUp)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var westDown = 103.1508,  // 103 09 03
          westUp = 283.0369,    // 283 02 13
          eastDown = 283.1375,  // 283 08 15
          eastUp = 103.0728,    // 103 04 22
          expected = 193.09950; // 193.0995

      expect(calc.magneticSouthMeridian(westDown, westUp,
        eastDown, eastUp)).to.be.closeTo(expected, 0.000001);
    });

  }); // END :: magneticSouthMeridian


  describe('magneticAzimuthMark()', function () {

    it('computes correctly', function () {
      var meanMark = 1.0,
          magneticSouthMeridian = 1.0,
          expected = 90.0;

      expect(calc.magneticAzimuthMark(
          meanMark, magneticSouthMeridian)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var meanMark = 100.50000,               // 100.5000
          magneticSouthMeridian = 180.42915,  // 180.4292
          expected = 10.07085;                // 10.0708

      expect(calc.magneticAzimuthMark(
          meanMark, magneticSouthMeridian))
          .to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var meanMark = 100.52488,               // 100.5249
          magneticSouthMeridian = 182.26035,  // 182.2603
          expected = 8.26453;                 // 8.2645

      expect(calc.magneticAzimuthMark(
          meanMark, magneticSouthMeridian))
          .to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var meanMark = 106.50533,               // 106.5053
          magneticSouthMeridian = 193.09950,  // 193.0995
          expected = 3.40583;                 // 3.4058

      expect(calc.magneticAzimuthMark(
          meanMark, magneticSouthMeridian))
          .to.be.closeTo(expected, 0.000001);
    });

  }); // END :: magneticAzimuthMark

  describe('geographicMeridian()', function () {

    it('computes correctly', function () {
      var markUp1 = 1.0,
          markUp2 = 2.0,
          trueAzimuthMark = 3.0,
          expected = -1.5;

      expect(calc.geographicMeridian(
          markUp1, markUp2, trueAzimuthMark)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var markUp1 = 10.5000,          // 10 30
          markUp2 = 10.5000,          // 10 30
          trueAzimuthMark = 199.1383, // 199.1383
          expected = -188.6383;

      expect(calc.geographicMeridian(markUp1, markUp2,
          trueAzimuthMark)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var markUp1 = 10.5256,         // 10 31 32
          markUp2 = 10.5250,         // 10 31 30
          trueAzimuthMark = 27.5613, // 27.5613
          expected = -17.0360;

      expect(calc.geographicMeridian(markUp1, markUp2,
          trueAzimuthMark)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var markUp1 = 196.5064,         // 196 30 23
          markUp2 = 196.5069,         // 196 30 25
          trueAzimuthMark = 16.7500,  // 16.7500
          expected = 179.75665;

      expect(calc.geographicMeridian(markUp1, markUp2,
          trueAzimuthMark)).to.be.closeTo(expected, 0.000001);
    });

  }); // END :: geographicMeridian

  describe('magneticDeclination()', function () {

    it('computes correctly when given no shift', function () {
      var magneticSouthMeridian = 1.0,
          geographicMeridian = 2.0,
          expected = 179.0;

      expect(calc.magneticDeclination(
          magneticSouthMeridian, geographicMeridian)).to.equal(expected);
    });

    it('computes correctly when given a positive shift', function () {
      var magneticSouthMeridian = 1.0,
          geographicMeridian = 2.0,
          shift = 3.0,
          expected = 182.0;

      expect(calc.magneticDeclination(
          magneticSouthMeridian, geographicMeridian, shift))
          .to.equal(expected);
    });

    it('computes correctly when given a negative shift', function () {
      var magneticSouthMeridian = 1.0,
          geographicMeridian = 2.0,
          shift = -3.0,
          expected = 176.0;

      expect(calc.magneticDeclination(
          magneticSouthMeridian, geographicMeridian, shift))
          .to.equal(expected);
    });

    it('computes correctly when given a 0 shift', function () {
      var magneticSouthMeridian = 1.0,
          geographicMeridian = 2.0,
          shift = 0,
          expected = 179.0;

      expect(calc.magneticDeclination(
          magneticSouthMeridian, geographicMeridian, shift))
          .to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var magneticSouthMeridian = 180.42915,  // 180.4292
          geographicMeridian = -188.6383,
          expected = 9.06745;                 // 9.0675

      expect(calc.magneticDeclination(magneticSouthMeridian,
          geographicMeridian)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var magneticSouthMeridian = 182.26035,  // 182.2603
          geographicMeridian = -17.0360,
          expected = 19.29635;                // 19.2968

      expect(calc.magneticDeclination(magneticSouthMeridian,
          geographicMeridian)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var magneticSouthMeridian = 193.09950,  // 193.0995
          geographicMeridian = 179.75665,
          expected = 13.34285;                // 13.3442

      expect(calc.magneticDeclination(magneticSouthMeridian,
          geographicMeridian)).to.be.closeTo(expected, 0.000001);
    });

  }); // END :: magneticDeclination

  describe('westUpMinusEastDown()', function () {

    it('computes correctly', function () {
      var westUp = 1.0,
          eastDown = 2.0,
          expected = -1.0;

      expect(calc.westUpMinusEastDown(westUp, eastDown)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var westUp = 90.4750,     // 90 28.5
          eastDown = 90.5050,   // 90 30.3
          expected = -0.0300;   // -1.80 converted to degrees

      expect(calc.westUpMinusEastDown(westUp,
          eastDown)).to.be.closeTo(expected, 0.00001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var westUp = 92.1722,     // 92 10 20
          eastDown = 92.1181,   // 92 07 05
          expected = 0.0541;    // 3.25 converted to degrees

      expect(calc.westUpMinusEastDown(westUp,
          eastDown)).to.be.closeTo(expected, 0.00001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var westUp = 283.0369,    // 283 02 13
          eastDown = 283.1375,  // 283 08 15
          expected = -0.1006;   // -6.03 converted to degrees

      expect(calc.westUpMinusEastDown(westUp,
          eastDown)).to.be.closeTo(expected, 0.00001);
    });

  }); // END :: westUpMinusEastDown

  describe('eastUpMinusWestDown()', function () {

    it('computes correctly', function () {
      var eastUp = 1.0,
          westDown = 2.0,
          expected = -1.0;

      expect(calc.eastUpMinusWestDown(eastUp, westDown)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var eastUp = 270.3833,    // 270 23.0
          westDown = 270.3533,  // 270 21.2
          expected = 0.0300;    // 1.80 converted to degrees

      expect(calc.eastUpMinusWestDown(eastUp,
          westDown)).to.be.closeTo(expected, 0.00001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var eastUp = 272.4400,    // 272 26 24
          westDown = 272.3111,  // 272 18 40
          expected = 0.1289;    // 7.73 converted to degrees

      expect(calc.eastUpMinusWestDown(eastUp,
          westDown)).to.be.closeTo(expected, 0.00001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var eastUp = 103.0728,    // 103 04 22
          westDown = 103.1508,  // 103 09 03
          expected = -0.078;    // -4.68 converted to degrees

      expect(calc.eastUpMinusWestDown(eastUp,
          westDown)).to.be.closeTo(expected, 0.00001);
    });

  }); // END :: eastUpMinusWestDown

  describe('fCorrected()', function () {

    it('computes correctly', function () {
      var fmean = 1.0,
          pierCorrection = 2.0,
          expected = 3.0;

      expect(calc.fCorrected(fmean, pierCorrection)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var fmean = 52558.61,       // 52558.61
          pierCorrection = -23.1, // -23.1
          expected = 52535.51;    // 52535.51

      expect(calc.fCorrected(fmean,
          pierCorrection)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var fmean = 56829.02,       // 56829.02
          pierCorrection = 10.5,  // 10.5
          expected = 56839.52;    // 56839.52

      expect(calc.fCorrected(fmean,
          pierCorrection)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var fmean = 48617.58,       // 48617.58
          pierCorrection = -15.5, // -15.5
          expected = 48602.08;    // 48602.08

      expect(calc.fCorrected(fmean,
          pierCorrection)).to.be.closeTo(expected, 0.000001);
    });

  }); // END :: fCorrected


  describe('inclination()', function () {

    it('computes correctly', function () {
      var southDown = 1.0,
          southUp = 2.0,
          northDown = 3.0,
          northUp = 4.0,
          expected = 90.0;

      expect(calc.inclination(
          southDown, southUp, northDown, northUp)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var southDown = 246.6650, // 246 39.9
          southUp = 113.3967,   // 113 23.8
          northDown = 293.4067, // 293 24.4
          northUp = 66.6467,    // 66 38.8
          expected = 66.62708;  // 66.6271

      expect(calc.inclination(southDown, southUp,
          northDown, northUp)).to.be.closeTo(expected, 0.00001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var southDown = 257.2544, // 257 15 16
          southUp = 102.6742,   // 102 40 27
          northDown = 282.6764, // 282 40 35
          northUp = 77.2500,    // 77 15 00
          expected = 77.28845;  // 77.2885

      expect(calc.inclination(southDown, southUp,
          northDown, northUp)).to.be.closeTo(expected, 0.00001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var southDown = 241.1031, // 241 06 11
          southUp = 118.8819,   // 118 52 55
          northDown = 298.8911, // 298 53 28
          northUp = 61.0925,    // 61 05 33
          expected = 61.10565;  // 61.1056

      expect(calc.inclination(southDown, southUp,
          northDown, northUp)).to.be.closeTo(expected, 0.00001);
    });

  }); // END :: inclination

  describe('horizontalComponent()', function () {

    it('computes correctly', function () {
      var fCorrected = 4.2,
          inclination = 0.0,
          expected = 4.2;

      expect(calc.horizontalComponent(
          fCorrected, inclination)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var fCorrected = 52535.51,  // 52535.51
          inclination = 66.62708, // 66.6271
          expected = 20841.57668; // 20841.57

      expect(calc.horizontalComponent(
          fCorrected, inclination)).to.be.closeTo(expected, 0.0001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var fCorrected = 56839.52,  // 56839.52
          inclination = 77.28845, // 77.2885
          expected = 12507.13017; // 12507.11

      expect(calc.horizontalComponent(
          fCorrected, inclination)).to.be.closeTo(expected, 0.0001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var fCorrected = 48602.08,  // 48602.08
          inclination = 61.10565, // 61.1056
          expected = 23484.3331;  // 23484.35

      expect(calc.horizontalComponent(
          fCorrected, inclination)).to.be.closeTo(expected, 0.0001);
    });

  }); // END :: horizontalComponent

  describe('verticalComponent()', function () {

    it('computes correctly', function () {
      var fCorrected = 4.2,
          inclination = 0.0,
          expected = 0.0;

      expect(calc.verticalComponent(
          fCorrected, inclination)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var fCorrected = 52535.51,  // 52535.51
          inclination = 66.62708, // 66.6271
          expected = 48224.56316; // 48224.56

      expect(calc.verticalComponent(
          fCorrected, inclination)).to.be.closeTo(expected, 0.0001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var fCorrected = 56839.52,  // 56839.52
          inclination = 77.28845, // 77.2885
          expected = 55446.39509; // 55446.40

      expect(calc.verticalComponent(
          fCorrected, inclination)).to.be.closeTo(expected, 0.0001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var fCorrected = 48602.08,  // 48602.08
          inclination = 61.10565, // 61.1056
          expected = 42551.713;   // 42551.70

      expect(calc.verticalComponent(
          fCorrected, inclination)).to.be.closeTo(expected, 0.0001);
    });

  }); // END :: verticalComponent

  describe('southDownMinusNorthUp()', function () {

    it('computes correctly', function () {
      var southDown = 182.0,
          northUp = 1.0,
          expected = 1.0;

      expect(calc.southDownMinusNorthUp(southDown,
          northUp)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var southDown = 246.6650, // 246 39.9
          northUp = 66.6467,    // 66 38.8
          expected = 0.0183;    // 1.10 converted to degrees

      expect(calc.southDownMinusNorthUp(southDown,
          northUp)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var southDown = 257.2544, // 257 15 16
          northUp = 77.2500,    // 77 15 00
          expected = 0.0044;    // 0.27 converted to degrees

      expect(calc.southDownMinusNorthUp(southDown,
          northUp)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var southDown = 241.1031, // 241 06 11
          northUp = 61.0925,    // 61 05 33
          expected = 0.0106;    // 0.63 converted to degrees

      expect(calc.southDownMinusNorthUp(southDown,
          northUp)).to.be.closeTo(expected, 0.000001);
    });

  }); // END :: southDownMinusNorthUp

  describe('northDownMinusSouthUp()', function () {

    it('computes correctly', function () {
      var northDown = 182.0,
          southUp = 1.0,
          expected = 1.0;

      expect(calc.northDownMinusSouthUp(northDown,
          southUp)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var northDown = 293.4067, // 293 24.4
          southUp = 113.3967,   // 113 23.8
          expected = 0.0100;    // 0.60 converted to degrees

      expect(calc.northDownMinusSouthUp(northDown,
          southUp)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var northDown = 282.6764, // 282 40 35
          southUp = 102.6742,   // 102 40 27
          expected = 0.0022;    // 0.13 converted to degrees

      expect(calc.northDownMinusSouthUp(northDown,
          southUp)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var northDown = 298.8911, // 298 53 28
          southUp = 118.8819,   // 118 52 55
          expected = 0.0092;    // 0.55 converted to degrees

      expect(calc.northDownMinusSouthUp(northDown,
          southUp)).to.be.closeTo(expected, 0.000001);
    });

  }); // END :: northDownMinusSouthUp


  describe('scaleValue()', function () {

    it('computes correctly', function () {
      var hAbsolute = BaselineCalculator.SCALE_VALUE_COEFFICIENT,
          expected = 1.0;

      expect(calc.scaleValue(hAbsolute)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var hAbsolute = 20841.57,     // 20841.57
          expected = 0.164946633;   // 0.1649

      expect(calc.scaleValue(
          hAbsolute)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var hAbsolute = 12507.11,     // 12507.11
          expected = 0.274863402;   // 0.2749

      expect(calc.scaleValue(
          hAbsolute)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var hAbsolute = 23484.35,     // 23484.35
          expected = 0.146384584;   // 0.1464

      expect(calc.scaleValue(
          hAbsolute)).to.be.closeTo(expected, 0.000001);
    });

  }); // END :: scaleValue


  describe('dComputed()', function () {

    it('computes correctly', function () {
      var eAbsolute = 1.0,
          scaleValue = 1.0,
          expected = 1.0/60.0;

      expect(calc.dComputed(eAbsolute, scaleValue)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var meanE = -155.48,          // -155.48
          scaleValue = 0.164946633, // 0.1649
          expected = -0.427431709;  // -25.65 converted to degrees

      expect(calc.dComputed(
          meanE, scaleValue)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var meanE = -48.66,           // -48.66
          scaleValue = 0.274863402, // 0.2749
          expected = -0.222914219;  // -13.37 converted to degrees

      expect(calc.dComputed(
          meanE, scaleValue)).to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var meanE = -311.22,          // -311.22
          scaleValue = 0.146384584, // 0.1464
          expected = -0.759296836;  // -45.56 converted to degrees

      expect(calc.dComputed(
          meanE, scaleValue)).to.be.closeTo(expected, 0.000001);
    });

  }); // END :: computedE


  describe('dBaseline()', function () {

    it('computes correctly', function () {
      var magneticDeclination = 1.0,
          dComputed = 0.5,
          expected = 0.5;

      expect(calc.dBaseline(
          magneticDeclination, dComputed)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var magneticDeclination = 9.0675, // 9.0675
          dComputed = -0.427431709,     // -25.65 converted to degrees
          expected = 9.494931709;       // 569.69 converted to degrees

      expect(calc.dBaseline(
          magneticDeclination, dComputed))
          .to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var magneticDeclination = 19.2968, // 19.2968
          dComputed = -0.222914219,      // -13.37 converted to degrees
          expected = 19.51971422;        // 1171.18 converted to degrees

      expect(calc.dBaseline(
          magneticDeclination, dComputed))
          .to.be.closeTo(expected, 0.000001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var magneticDeclination = 13.3442,  // 13.3442
          dComputed = -0.759296836,       // -45.56 converted to degrees
          expected = 14.10349684;         // 846.21 converted to degrees

      expect(calc.dBaseline(
          magneticDeclination, dComputed))
          .to.be.closeTo(expected, 0.000001);
    });

  }); // END :: dBaseline

  describe('hBaseline()', function () {

    it('computes correctly', function () {
      var hAbsolute = 10.0,
          hComputed = 5.0,
          expected = 5.0;

      expect(calc.hBaseline(hAbsolute, hComputed)).to.equal(expected);
    });

  }); // END :: baselineH

  describe('zBaseline()', function () {

    it('computes correctly', function () {
      var zAbsolute = 10.0,
          zComputed = 5.0,
          expected = 5.0;

      expect(calc.zBaseline(zAbsolute, zComputed)).to.equal(expected);
    });

  }); // END :: baselineZ

  describe('eBaseline()', function () {

    it('computes correctly', function () {
      var dBaseline = 10.0,
          scaleValue = 10.0,
          expected = 60.0;

      expect(calc.eBaseline(dBaseline, scaleValue)).to.equal(expected);
    });

    it('computes correctly with data from BDT20131651602.bns', function () {
      var dBaseline = 9.494931709,  // 569.69 converted to degrees
          scaleValue = 0.164946633, // 0.1649
          expected = 3453.819528;   // 3453.78

      expect(calc.eBaseline(dBaseline,
          scaleValue)).to.be.closeTo(expected, 0.0001);
    });

    it('computes correctly with data from CMO20131651602.bns', function () {
      var dBaseline = 19.51971422,   // 1171.18 converted to degrees
          scaleValue = 0.274863402,  // 0.2749
          expected = 4260.963249;    // 4260.95

      expect(calc.eBaseline(dBaseline,
          scaleValue)).to.be.closeTo(expected, 0.0001);
    });

    it('computes correctly with data from FRN20130311611.bns', function () {
      var dBaseline = 14.10349684,  // 846.21 converted to degrees
          scaleValue = 0.146384584, // 0.1464
          expected = 5780.730377;   // 5780.73

      expect(calc.eBaseline(dBaseline,
          scaleValue)).to.be.closeTo(expected, 0.0001);
    });

  });

}); // END :: Unit tests for BaselineCalculator
