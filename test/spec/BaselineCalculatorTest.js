/* global define, describe, it */

define([
	'chai',
	'geomag/BaselineCalculator'
], function (
	chai,
	BaselineCalculator
) {
	'use strict';

	var expect = chai.expect,
	    calc = new BaselineCalculator(),
	    EPSILON = 0.00001;

	describe('Unit tests for BaselineCalculator', function () {

		// --------------------------------------------------------------
		// Tests for helper methods
		// --------------------------------------------------------------

		describe('_mean()', function () {

			it('returns NaN when no values are given', function () {
				expect(isNaN(calc._mean())).to.equal(true);
			});

			it('works with a single value', function () {
				expect(calc._mean(42)).to.equal(42);
				expect(calc._mean(9.2)).to.equal(9.2);
			});

			it('works with several values', function () {
				expect(calc._mean(1, 2, 3, 4, 5)).to.equal(3);
				expect(calc._mean(0.0, 0.5, 1.0, 1.5, 2.0)).to.equal(1.0);
			});

			it('works when some non-numeric values are given', function () {
				expect(calc._mean(1, 2, 3, 'hello', 4, 5)).to.equal(3);
				expect(calc._mean(0.0, 0.5, 'goodbye', 1.0, 1.5, 2.0)).to.equal(1.0);
			});

			it('works when some number-ish strings are given', function () {
				expect(calc._mean(1, 2, 3, '5000', 4, 5)).to.equal(3);
				expect(calc._mean(0.0, 0.5, '999.9', 1.0, 1.5, 2.0)).to.equal(1.0);
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
				var westDown = 270.3533,	// 270 21.2
				    westUp = 90.4750,			//  90 28.5
				    eastDown = 90.5050,		//  90 30.3
				    eastUp = 270.3833,		// 270 23.0
				    expected = 180.42915;	// 180.4292

				expect(Math.abs(calc.magneticSouthMeridian(westDown, westUp,
						eastDown, eastUp) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var westDown = 272.3111,	// 272 18 40
				    westUp = 92.1722,			//  92 10 20
				    eastDown = 92.1181,		//  92 07 05
				    eastUp = 272.4400,		// 272 26 24
				    expected = 182.26035;	// 182.2603

				expect(Math.abs(calc.magneticSouthMeridian(westDown, westUp,
						eastDown, eastUp) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var westDown = 103.1508,	// 103 09 03
				    westUp = 283.0369,		// 283 02 13
				    eastDown = 283.1375,	// 283 08 15
				    eastUp = 103.0728,		// 103 04 22
				    expected = 193.09950;	// 193.0995

				expect(Math.abs(calc.magneticSouthMeridian(westDown, westUp,
					eastDown, eastUp) - expected)).to.be.below(EPSILON);
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
				var meanMark = 100.50000,								// 100.5000
				    magneticSouthMeridian = 180.42915,	// 180.4292
				    expected = 10.07085;								// 10.0708

				expect(Math.abs(calc.magneticAzimuthMark(
						meanMark, magneticSouthMeridian) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var meanMark = 100.52488,								// 100.5249
				    magneticSouthMeridian = 182.26035,	// 182.2603
				    expected = 8.26453;									// 8.2645

				expect(Math.abs(calc.magneticAzimuthMark(
						meanMark, magneticSouthMeridian) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var meanMark = 106.50533,								// 106.5053
				    magneticSouthMeridian = 193.09950,	// 193.0995
				    expected = 3.40583;									// 3.4058

				expect(Math.abs(calc.magneticAzimuthMark(
						meanMark, magneticSouthMeridian) - expected)).to.be.below(EPSILON);
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
				var markUp1 = 10.5000,					// 10 30
				    markUp2 = 10.5000,					// 10 30
				    trueAzimuthMark = 199.1383,	// 199.1383
				    expected = -188.6383;

				expect(Math.abs(calc.geographicMeridian(markUp1, markUp2,
						trueAzimuthMark) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var markUp1 = 10.5256,					// 10 31 32
				    markUp2 = 10.5250,					// 10 31 30
				    trueAzimuthMark = 27.5613,	// 27.5613
				    expected = -17.0360;

				expect(Math.abs(calc.geographicMeridian(markUp1, markUp2,
						trueAzimuthMark) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var markUp1 = 196.5064,					// 196 30 23
				    markUp2 = 196.5069,					// 196 30 25
				    trueAzimuthMark = 16.7500,	// 16.7500
				    expected = 179.75665;

				expect(Math.abs(calc.geographicMeridian(markUp1, markUp2,
						trueAzimuthMark) - expected)).to.be.below(EPSILON);
			});

		}); // END :: geographicMeridian

		describe('magneticDeclination()', function () {

			it('computes correctly', function () {
				var magneticSouthMeridian = 1.0,
				    geographicMeridian = 2.0,
				    expected = 179.0;

				expect(calc.magneticDeclination(
						magneticSouthMeridian, geographicMeridian)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var magneticSouthMeridian = 180.42915,	// 180.4292
				    geographicMeridian = -188.6383,
				    expected = 9.06745;								// 9.0675

				expect(Math.abs(calc.magneticDeclination(magneticSouthMeridian,
						geographicMeridian) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var magneticSouthMeridian = 182.26035,	// 182.2603
				    geographicMeridian = -17.0360,
				    expected = 19.29635;								// 19.2968

				expect(Math.abs(calc.magneticDeclination(magneticSouthMeridian,
						geographicMeridian) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var magneticSouthMeridian = 193.09950,	// 193.0995
				    geographicMeridian = 179.75665,
				    expected = 13.34285;								// 13.3442

				expect(Math.abs(calc.magneticDeclination(magneticSouthMeridian,
						geographicMeridian) - expected)).to.be.below(EPSILON);
			});

		}); // END :: magneticDeclination

		describe('w()', function () {

			it('computes correctly', function () {
				var westUp = 1.0,
				    eastDown = 2.0,
				    expected = -1.0;

				expect(calc.w(westUp, eastDown)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var westUp = 90.4750,		// 90 28.5
				    eastDown = 90.5050,	// 90 30.3
				    expected = -1.80/60.0;		// -1.80

				expect(Math.abs(calc.w(westUp,
						eastDown) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var westUp = 92.1722,		// 92 10 20
				    eastDown = 92.1181,	// 92 07 05
				    expected = 3.246/60.0;		// 3.25

				expect(Math.abs(calc.w(westUp,
						eastDown) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var westUp = 283.0369,		// 283 02 13
				    eastDown = 283.1375,	// 283 08 15
				    expected = -6.036/60.0;		// -6.03

				expect(Math.abs(calc.w(westUp,
						eastDown) - expected)).to.be.below(EPSILON);
			});

		}); // END :: w

		describe('e()', function () {

			it('computes correctly', function () {
				var eastUp = 1.0,
				    westDown = 2.0,
				    expected = -1.0;

				expect(calc.w(eastUp, westDown)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var eastUp = 270.3833,		// 270 23.0
				    westDown = 270.3533,	// 270 21.2
				    expected = 1.800/60.0;			// 1.80

				expect(Math.abs(calc.w(eastUp,
						westDown) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var eastUp = 272.4400,		// 272 26 24
				    westDown = 272.3111,	// 272 18 40
				    expected = 7.734/60.0;			// 7.73

				expect(Math.abs(calc.w(eastUp,
						westDown) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var eastUp = 103.0728,		// 103 04 22
				    westDown = 103.1508,	// 103 09 03
				    expected = -4.680/60.0;		// -4.68

				expect(Math.abs(calc.w(eastUp,
						westDown) - expected)).to.be.below(EPSILON);
			});

		}); // END :: e

		describe('correctedF()', function () {

			it('computes correctly', function () {
				var fmean = 1.0,
				    pierCorrection = 2.0,
				    expected = 3.0;

				expect(calc.correctedF(fmean, pierCorrection)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var fmean = 52558.61,				// 52558.61
				    pierCorrection = -23.1,	// -23.1
				    expected = 52535.51;		// 52535.51

				expect(Math.abs(calc.correctedF(fmean,
						pierCorrection) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var fmean = 56829.02,				// 56829.02
				    pierCorrection = 10.5,	// 10.5
				    expected = 56839.52;		// 56839.52

				expect(Math.abs(calc.correctedF(fmean,
						pierCorrection) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var fmean = 48617.58,				// 48617.58
				    pierCorrection = -15.5,	// -15.5
				    expected = 48602.08;		// 48602.08

				expect(Math.abs(calc.correctedF(fmean,
						pierCorrection) - expected)).to.be.below(EPSILON);
			});

		}); // END :: correctedF


		describe('inclincation()', function () {

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
				var southDown = 246.6650,	// 246 39.9
				    southUp = 113.3967,		// 113 23.8
				    northDown = 293.4067,	// 293 24.4
				    northUp = 66.6467,		// 66 38.8
				    expected = 66.62708;	// 66.6271

				expect(Math.abs(calc.inclination(southDown, southUp,
						northDown, northUp) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var southDown = 257.2544,	// 257 15 16
				    southUp = 102.6742,		// 102 40 27
				    northDown = 282.6764,	// 282 40 35
				    northUp = 77.2500,		// 77 15 00
				    expected = 77.28845;	// 77.2885

				expect(Math.abs(calc.inclination(southDown, southUp,
						northDown, northUp) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var southDown = 241.1031,	// 241 06 11
				    southUp = 118.8819,		// 118 52 55
				    northDown = 298.8911,	// 298 53 28
				    northUp = 61.0925,		// 61 05 33
				    expected = 61.10565;	// 61.1056

				expect(Math.abs(calc.inclination(southDown, southUp,
						northDown, northUp) - expected)).to.be.below(EPSILON);
			});

		}); // END :: inclination

		describe('horizontalComponent()', function () {

			it('computes correctly', function () {
				var correctedF = 4.2,
				    inclination = 0.0,
				    expected = 4.2;

				expect(calc.horizontalComponent(
						correctedF, inclination)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var correctedF = 52535.51,	// 52535.51
				    inclination = 66.62708,	// 66.6271
				    expected = 20841.57668;		// 20841.57

				expect(Math.abs(calc.horizontalComponent(
						correctedF, inclination) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var correctedF = 56839.52,	// 56839.52
				    inclination = 77.28845,	// 77.2885
				    expected = 12507.13017;		// 12507.11

				expect(Math.abs(calc.horizontalComponent(
						correctedF, inclination) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var correctedF = 48602.08,	// 48602.08
				    inclination = 61.10565,	// 61.1056
				    expected = 23484.3331;		// 23484.35

				expect(Math.abs(calc.horizontalComponent(
						correctedF, inclination) - expected)).to.be.below(EPSILON);
			});

		}); // END :: horizontalComponent

		describe('verticalComponent()', function () {

			it('computes correctly', function () {
				var correctedF = 4.2,
				    inclination = 0.0,
				    expected = 0.0;

				expect(calc.verticalComponent(
						correctedF, inclination)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var correctedF = 52535.51,	// 52535.51
				    inclination = 66.62708,	// 66.6271
				    expected = 48224.56316;		// 48224.56

				expect(Math.abs(calc.verticalComponent(
						correctedF, inclination) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var correctedF = 56839.52,	// 56839.52
				    inclination = 77.28845,	// 77.2885
				    expected = 55446.39509;		// 55446.40

				expect(Math.abs(calc.verticalComponent(
						correctedF, inclination) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var correctedF = 48602.08,	// 48602.08
				    inclination = 61.10565,	// 61.1056
				    expected = 42551.713;		// 42551.70

				expect(Math.abs(calc.verticalComponent(
						correctedF, inclination) - expected)).to.be.below(EPSILON);
			});

		}); // END :: verticalComponent

		describe('s()', function () {

			it('computes correctly', function () {
				var southDown = 182.0,
				    northUp = 1.0,
				    expected = 1.0;

				expect(calc.s(southDown, northUp)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var southDown = 246.6650,	// 246 39.9
				    northUp = 66.6467,		// 66 38.8
				    expected = 1.098/60.0;			// 1.10

				expect(Math.abs(calc.s(
						southDown, northUp) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var southDown = 257.2544,	// 257 15 16
				    northUp = 77.2500,		// 77 15 00
				    expected = 0.264/60.0;			// 0.27

				expect(Math.abs(calc.s(
						southDown, northUp) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var southDown = 241.1031,	// 241 06 11
				    northUp = 61.0925,		// 61 05 33
				    expected = 0.636/60.0;			// 0.63

				expect(Math.abs(calc.s(
						southDown, northUp) - expected)).to.be.below(EPSILON);
			});

		}); // END :: s

		describe('n()', function () {

			it('computes correctly', function () {
				var northDown = 182.0,
				    southUp = 1.0,
				    expected = 1.0;

				expect(calc.n(northDown, southUp)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var northDown = 293.4067,	// 293 24.4
				    southUp = 113.3967,		// 113 23.8
				    expected = 0.60/60.0;			// 0.60

				expect(Math.abs(calc.n(
						northDown, southUp) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var northDown = 282.6764,	// 282 40 35
				    southUp = 102.6742,		// 102 40 27
				    expected = 0.132/60.0;			// 0.13

				expect(Math.abs(calc.n(
						northDown, southUp) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var northDown = 298.8911,	// 298 53 28
				    southUp = 118.8819,		// 118 52 55
				    expected = 0.552/60.0;			// 0.55

				expect(Math.abs(calc.n(
						northDown, southUp) - expected)).to.be.below(EPSILON);
			});

		}); // END :: n


		describe('scaleValue()', function () {

			it('computes correctly', function () {
				var absoluteH = BaselineCalculator.SCALE_VALUE_COEFFIFIENT,
				    expected = 1.0;

				expect(calc.scaleValue(absoluteH)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var absoluteH = 20841.57,			// 20841.57
				    expected = 0.164946633;		// 0.1649

				expect(Math.abs(calc.scaleValue(
						absoluteH) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var absoluteH = 12507.11,			// 12507.11
				    expected = 0.274863402;		// 0.2749

				expect(Math.abs(calc.scaleValue(
						absoluteH) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var absoluteH = 23484.35,			// 23484.35
				    expected = 0.146384584;		// 0.1464

				expect(Math.abs(calc.scaleValue(
						absoluteH) - expected)).to.be.below(EPSILON);
			});

		}); // END :: scaleValue


		describe('computedE()', function () {

			it('computes correctly', function () {
				var absoluteE = 1.0,
				    scaleValue = 1.0,
				    expected = 1.0/60.0;

				expect(calc.computedE(absoluteE, scaleValue)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var meanE = -155.48,					// -155.48
				    scaleValue = 0.164946633,	// 0.1649
				    expected = -0.427431709;	// -25.65 / 60.0

				expect(Math.abs(calc.computedE(
						meanE, scaleValue) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var meanE = -48.66,						// -48.66
				    scaleValue = 0.274863402,	// 0.2749
				    expected = -0.222914219;	// -13.37 / 60.0

				expect(Math.abs(calc.computedE(
						meanE, scaleValue) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var meanE = -311.22,					// -311.22
				    scaleValue = 0.146384584,	// 0.1464
				    expected = -0.759296836;	// -45.56 / 60.0

				expect(Math.abs(calc.computedE(
						meanE, scaleValue) - expected)).to.be.below(EPSILON);
			});

		}); // END :: computedE


		describe('baselineD()', function () {

			it('computes correctly', function () {
				var magneticDeclination = 1.0,
				    computedE = 0.5,
				    expected = 0.5;

				expect(calc.baselineD(
						magneticDeclination, computedE)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var magneticDeclination = 9.0675,	// 9.0675
				    computedE = -0.427431709,			// -25.65 in degrees now
				    expected = 9.494931709;				// 569.69

				expect(Math.abs(calc.baselineD(
						magneticDeclination, computedE) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var magneticDeclination = 19.2968,	// 19.2968
				    computedE = -0.222914219,				// -13.37 in degrees now
				    expected = 19.51971422;					// 1171.18

				expect(Math.abs(calc.baselineD(
						magneticDeclination, computedE) - expected)).to.be.below(EPSILON);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var magneticDeclination = 13.3442,	// 13.3442
				    computedE = -0.759296836,				// -45.56 in degrees now
				    expected = 14.10349684;					// 846.21

				expect(Math.abs(calc.baselineD(
						magneticDeclination, computedE) - expected)).to.be.below(EPSILON);
			});

		}); // END :: baselineD

		describe('baselineH()', function () {

			it('computes correctly', function () {
				var absoluteH = 10.0,
				    computedH = 5.0,
				    expected = 5.0;

				expect(calc.baselineH(absoluteH, computedH)).to.equal(expected);
			});

		}); // END :: baselineH

		describe('baselineZ()', function () {

			it('computes correctly', function () {
				var absoluteZ = 10.0,
				    computedZ = 5.0,
				    expected = 5.0;

				expect(calc.baselineZ(absoluteZ, computedZ)).to.equal(expected);
			});

		}); // END :: baselineZ

		describe('d()', function () {

			it('computes correctly', function () {
				var baselineD = 10.0,
				    scaleValue = 10.0,
				    expected = 1.0;

				expect(calc.d(baselineD, scaleValue)).to.equal(expected);
			});

		});

	}); // END :: Unit tests for BaselineCalculator
});
