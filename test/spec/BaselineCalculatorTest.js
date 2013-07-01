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
	    calc = new BaselineCalculator();

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

				expect(calc.magneticSouthMeridian(
						westDown, westUp, eastDown, eastUp) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var westDown = 272.3111,	// 272 18 40
				    westUp = 92.1722,			//  92 10 20
				    eastDown = 92.1181,		//  92 07 05
				    eastUp = 272.4400,		// 272 26 24
				    expected = 182.26035;	// 182.2603

				expect(calc.magneticSouthMeridian(
						westDown, westUp, eastDown, eastUp) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var westDown = 103.1508,	// 103 09 03
				    westUp = 283.0369,		// 283 02 13
				    eastDown = 283.1375,	// 283 08 15
				    eastUp = 103.0728,		// 103 04 22
				    expected = 193.09950;	// 193.0995

				expect(calc.magneticSouthMeridian(
						westDown, westUp, eastDown, eastUp) - expected < 0.00001);
			});

		}); // END :: magneticSouthMeridian

		describe('meanMark()', function () {

			it('computes correctly', function () {
				var markDown1 = 1.0,
				    markUp1 = 2.0,
				    markDown2 = 3.0,
				    markUp2 = 4.0,
				    expected = 2.5;

				expect(calc.meanMark(
						markDown1, markUp1, markDown2, markUp2)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var markDown1 = 190.5000,	// 190 30
				    markUp1 = 10.5000,		// 10 30
				    markDown2 = 190.5000,	// 190 30
				    markUp2 = 10.5000,		// 10 30
				    expected = 100.50000;	// 100.5000

				expect(calc.meanMark(
						markDown1, markUp1, markDown2, markUp2) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var markDown1 = 190.5247,	// 190 31 29
				    markUp1 = 10.5256,		// 10 31 32
				    markDown2 = 190.5242,	// 190 31 27
				    markUp2 = 10.5250,		// 10 31 30
				    expected = 100.52488;	// 100.5249

				expect(calc.meanMark(
						markDown1, markUp1, markDown2, markUp2) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var markDown1 = 16.5036,	// 16 30 13
				    markUp1 = 196.5064,		// 196 30 23
				    markDown2 = 16.5044,	// 16 30 16
				    markUp2 = 196.5069,		// 196 30 25
				    expected = 106.50533;	// 106.5053

				expect(calc.meanMark(
						markDown1, markUp1, markDown2, markUp2) - expected < 0.00001);
			});

		}); // END :: meanMark

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

				expect(calc.magneticAzimuthMark(
						meanMark, magneticSouthMeridian) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var meanMark = 100.52488,								// 100.5249
				    magneticSouthMeridian = 182.26035,	// 182.2603
				    expected = 8.26453;									// 8.2645

				expect(calc.magneticAzimuthMark(
						meanMark, magneticSouthMeridian) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var meanMark = 106.50533,								// 106.5053
				    magneticSouthMeridian = 193.09950,	// 193.0995
				    expected = 3.40583;									// 3.4058

				expect(calc.magneticAzimuthMark(
						meanMark, magneticSouthMeridian) - expected < 0.00001);
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

				expect(calc.geographicMeridian(
						markUp1, markUp2, trueAzimuthMark) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var markUp1 = 10.5256,					// 10 31 32
				    markUp2 = 10.5250,					// 10 31 30
				    trueAzimuthMark = 27.5613,	// 27.5613
				    expected = -17.0360;

				expect(calc.geographicMeridian(
						markUp1, markUp2, trueAzimuthMark) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var markUp1 = 196.5064,					// 196 30 23
				    markUp2 = 196.5069,					// 196 30 25
				    trueAzimuthMark = 16.7500,	// 16.7500
				    expected = 179.75665;

				expect(calc.geographicMeridian(
						markUp1, markUp2, trueAzimuthMark) - expected < 0.00001);
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

				expect(calc.magneticDeclination(
						magneticSouthMeridian, geographicMeridian) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var magneticSouthMeridian = 182.26035,	// 182.2603
				    geographicMeridian = -17.0360,
				    expected = 19.29635;								// 19.2968

				expect(calc.magneticDeclination(
						magneticSouthMeridian, geographicMeridian) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var magneticSouthMeridian = 193.09950,	// 193.0995
				    geographicMeridian = 179.75665,
				    expected = 13.34285;								// 13.3442

				expect(calc.magneticDeclination(
						magneticSouthMeridian, geographicMeridian) - expected < 0.00001);
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

				expect(calc.w(westUp, eastDown) - expected).to.be.below(0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var westUp = 92.1722,		// 92 10 20
				    eastDown = 92.1181,	// 92 07 05
				    expected = 3.246/60.0;		// 3.25

				expect(calc.w(westUp, eastDown) - expected).to.be.below(0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var westUp = 283.0369,		// 283 02 13
				    eastDown = 283.1375,	// 283 08 15
				    expected = -6.036/60.0;		// -6.03

				expect(calc.w(westUp, eastDown) - expected).to.be.below(0.00001);
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

				expect(calc.w(eastUp, westDown) - expected).to.be.below(0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var eastUp = 272.4400,		// 272 26 24
				    westDown = 272.3111,	// 272 18 40
				    expected = 7.734/60.0;			// 7.73

				expect(calc.w(eastUp, westDown) - expected).to.be.below(0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var eastUp = 103.0728,		// 103 04 22
				    westDown = 103.1508,	// 103 09 03
				    expected = -4.680/60.0;		// -4.68

				expect(calc.w(eastUp, westDown) - expected).to.be.below(0.00001);
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

				expect(calc.correctedF(fmean, pierCorrection) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var fmean = 56829.02,				// 56829.02
				    pierCorrection = 10.5,	// 10.5
				    expected = 56839.52;		// 56839.52

				expect(calc.correctedF(fmean, pierCorrection) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var fmean = 48617.58,				// 48617.58
				    pierCorrection = -15.5,	// -15.5
				    expected = 48602.08;		// 48602.08

				expect(calc.correctedF(fmean, pierCorrection) - expected < 0.00001);
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

				expect(calc.inclination(
						southDown, southUp, northDown, northUp) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var southDown = 257.2544,	// 257 15 16
				    southUp = 102.6742,		// 102 40 27
				    northDown = 282.6764,	// 282 40 35
				    northUp = 77.2500,		// 77 15 00
				    expected = 77.28845;	// 77.2885

				expect(calc.inclination(
						southDown, southUp, northDown, northUp) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var southDown = 241.1031,	// 241 06 11
				    southUp = 118.8819,		// 118 52 55
				    northDown = 298.8911,	// 298 53 28
				    northUp = 61.0925,		// 61 05 33
				    expected = 61.10565;	// 61.1056

				expect(calc.inclination(
						southDown, southUp, northDown, northUp) - expected < 0.00001);
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
				    expected = 20841.57;		// 20841.57

				expect(calc.horizontalComponent(
						correctedF, inclination) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var correctedF = 56839.52,	// 56839.52
				    inclination = 77.28845,	// 77.2885
				    expected = 12507.11;		// 12507.11

				expect(calc.horizontalComponent(
						correctedF, inclination) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var correctedF = 48602.08,	// 48602.08
				    inclination = 61.10565,	// 61.1056
				    expected = 23484.35;		// 23484.35

				expect(calc.horizontalComponent(
						correctedF, inclination) - expected < 0.00001);
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
				    expected = 48224.56;		// 48224.56

				expect(calc.verticalComponent(
						correctedF, inclination) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var correctedF = 56839.52,	// 56839.52
				    inclination = 77.28845,	// 77.2885
				    expected = 55446.40;		// 55446.40

				expect(calc.verticalComponent(
						correctedF, inclination) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var correctedF = 48602.08,	// 48602.08
				    inclination = 61.10565,	// 61.1056
				    expected = 42551.70;		// 42551.70

				expect(calc.verticalComponent(
						correctedF, inclination) - expected < 0.00001);
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

				expect(calc.s(southDown, northUp) - expected).to.be.below(0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var southDown = 257.2544,	// 257 15 16
				    northUp = 77.2500,		// 77 15 00
				    expected = 0.264/60.0;			// 0.27

				expect(calc.s(southDown, northUp) - expected).to.be.below(0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var southDown = 241.1031,	// 241 06 11
				    northUp = 61.0925,		// 61 05 33
				    expected = 0.636/60.0;			// 0.63

				expect(calc.s(southDown, northUp) - expected).to.be.below(0.00001);
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

				expect(calc.n(northDown, southUp) - expected).to.be.below(0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var northDown = 282.6764,	// 282 40 35
				    southUp = 102.6742,		// 102 40 27
				    expected = 0.132/60.0;			// 0.13

				expect(calc.n(northDown, southUp) - expected).to.be.below(0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var northDown = 298.8911,	// 298 53 28
				    southUp = 118.8819,		// 118 52 55
				    expected = 0.552/60.0;			// 0.55

				expect(calc.n(northDown, southUp) - expected).to.be.below(0.00001);
			});

		}); // END :: n


		describe('meanH()', function () {

			it('computes correctly', function () {
				var h1 = 1.0,
				    h2 = 2.0,
				    h3 = 3.0,
				    h4 = 4.0,
				    expected = 2.5;

				expect(calc.meanH(h1, h2, h3, h4)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var h1 = 21537.16,				// 21537.16
				    h2 = 21537.03,				// 21537.03
				    h3 = 21537.15,				// 21537.15
				    h4 = 21536.76,				// 21536.76
				    expected = 21537.025;	// 21537.03

				expect(calc.meanH(h1, h2, h3, h4) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var h1 = 12301.93,					// 12301.93
				    h2 = 12306.66,					// 12306.66
				    h3 = 12304.10,					// 12304.10
				    h4 = 12306.02,					// 12306.02
				    expected = 12304.6775;	// 12304.68

				expect(calc.meanH(h1, h2, h3, h4) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var h1 = 23592.49,					// 23592.49
				    h2 = 23592.71,					// 23592.71
				    h3 = 23591.87,					// 23591.87
				    h4 = 23592.42,					// 23592.43
				    expected = 23592.3725;	// 23592.38

				expect(calc.meanH(h1, h2, h3, h4) - expected < 0.00001);
			});

		}); // END :: meanH

		describe('meanE()', function () {

			it('computes correctly', function () {
				var e1 = 1.0,
				    e2 = 2.0,
				    e3 = 3.0,
				    e4 = 4.0,
				    expected = 2.5;

				expect(calc.meanE(e1, e2, e3, e4)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var e1 = -155.23,					// -155.23
				    e2 = -155.44,					// -155.44
				    e3 = -155.42,					// -155.42
				    e4 = -155.84,					// -155.84
				    expected = -155.4825;	// -155.48

				expect(calc.meanE(e1, e2, e3, e4) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var e1 = -57.13,					// -57.13
				    e2 = -49.66,					// -49.66
				    e3 = -43.22,					// -43.22
				    e4 = -44.63,					// -44.63
				    expected = -48.6600;	// -48.66

				expect(calc.meanE(e1, e2, e3, e4) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var e1 = -310.20,					// -310.20
				    e2 = -310.46,					// -310.46
				    e3 = -310.96,					// -310.96
				    e4 = -313.27,					// -313.27
				    expected = -311.2225;	// -311.22

				expect(calc.meanE(e1, e2, e3, e4) - expected < 0.00001);
			});

		}); // END :: meanE

		describe('meanZ()', function () {

			it('computes correctly', function () {
				var z1 = 1.0,
				    z2 = 2.0,
				    z3 = 3.0,
				    z4 = 4.0,
				    expected = 2.5;

				expect(calc.meanZ(z1, z2, z3, z4)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var z1 = 47827.21,					// 47827.21
				    z2 = 47827.11,					// 47827.11
				    z3 = 47826.83,					// 47826.82
				    z4 = 47826.89,					// 47826.89
				    expected = 47827.0100;	// 47827.01

				expect(calc.meanZ(z1, z2, z3, z4) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var z1 = 55499.07,					// 55449.07
				    z2 = 55501.49,					// 55501.49
				    z3 = 55503.40,					// 55503.40
				    z4 = 55502.60,					// 55502.60
				    expected = 55501.6400;	// 55501.64

				expect(calc.meanZ(z1, z2, z3, z4) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var z1 = 42519.54,					// 42519.54
				    z2 = 42519.47,					// 42519.47
				    z3 = 42519.43,					// 42519.43
				    z4 = 42519.35,					// 42519.35
				    expected = 42519.4475;	// 42519.45

				expect(calc.meanZ(z1, z2, z3, z4) - expected < 0.00001);
			});

		}); // END :: meanZ

		describe('meanF()', function () {

			it('computes correctly', function () {
				var f1 = 1.0,
				    f2 = 2.0,
				    f3 = 3.0,
				    f4 = 4.0,
				    expected = 2.5;

				expect(calc.meanF(f1, f2, f3, f4)).to.equal(expected);
			});

			it('computes correctly with data from BDT20131651602.bns', function () {
				var f1 = 52558.84,					// 52558.84
				    f2 = 52558.70,					// 52558.70
				    f3 = 52558.50,					// 52558.50
				    f4 = 52558.40,					// 52558.40
				    expected = 52558.6100;	// 52558.61

				expect(calc.meanF(f1, f2, f3, f4) - expected < 0.00001);
			});

			it('computes correctly with data from CMO20131651602.bns', function () {
				var f1 = 56825.81,				// 56825.81
				    f2 = 56829.26,				// 56829.26
				    f3 = 56830.65,				// 56830.65
				    f4 = 56830.34,				// 56830.34
				    expected = 56829.015;	// 56829.02

				expect(calc.meanF(f1, f2, f3, f4) - expected < 0.00001);
			});

			it('computes correctly with data from FRN20130311611.bns', function () {
				var f1 = 48617.72,					// 48617.72
				    f2 = 48617.78,					// 48617.78
				    f3 = 48617.30,					// 48617.30
				    f4 = 48617.51,					// 48617.51
				    expected = 48617.5775;	// 48617.58

				expect(calc.meanF(f1, f2, f3, f4) - expected < 0.00001);
			});

		}); // END :: meanF


		describe('scaleValue()', function () {

			it('computes correctly', function () {
				var absoluteH = BaselineCalculator.SCALE_VALUE_COEFFIFIENT,
				    expected = 1.0;

				expect(calc.scaleValue(absoluteH)).to.equal(expected);
			});

		}); // END :: scaleValue


		describe('computedE()', function () {

			it('computes correctly', function () {
				var absoluteE = 1.0,
				    scaleValue = 1.0,
				    expected = 1.0;

				expect(calc.computedE(absoluteE, scaleValue)).to.equal(expected);
			});

		}); // END :: computedE


		describe('baselineD()', function () {

			it('computes correctly', function () {
				var magneticDeclination = 1.0,
				    computedE = 50.0,
				    expected = 600.0;

				expect(calc.baselineD(
						magneticDeclination, computedE)).to.equal(expected);
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
