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
				var westDown = 270.3533,  // 270 21.2
				    westUp = 90.4750,     //  90 28.5
				    eastDown = 90.5050,   //  90 30.3
				    eastUp = 270.3833,    // 270 23.0
				    expected = 180.42915; // 180.4292

				expect(calc.magneticSouthMeridian(
						westDown, westUp, eastDown, eastUp)).to.equal(expected);
			});
			
			it('computes correctly with data from CMO20131651602.bns', function () {
				var westDown = 272.3111, // 272 18 40
				    westUp = 92.1722,    //  92 10 20
				    eastDown = 92.1181,  //  92 07 05
				    eastUp = 272.4400,   // 272 26 24
				    expected = 182.26035;// 182.2603

				expect(calc.magneticSouthMeridian(
						westDown, westUp, eastDown, eastUp)).to.equal(expected);
			});
			
			it('computes correctly with data from FRN20130311611.bns', function () {
				var westDown = 103.1508, // 103 09 03
				    westUp = 283.0369,   // 283 02 13
				    eastDown = 283.1375, // 283 08 15
				    eastUp = 103.0728,   // 103 04 22
				    expected = 193.0995; // 193.0995

				expect(calc.magneticSouthMeridian(
						westDown, westUp, eastDown, eastUp)).to.equal(expected);
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

		}); // END :: meanMark

		describe('magneticAzimuthMark()', function () {

			it('computes correctly', function () {
				var meanMark = 1.0,
				    magneticSouthMeridian = 1.0,
				    expected = 90.0;

				expect(calc.magneticAzimuthMark(
						meanMark, magneticSouthMeridian)).to.equal(expected);
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

		}); // END :: geographicMeridian

		describe('magneticDeclination()', function () {

			it('computes correctly', function () {
				var magneticSouthMeridian = 1.0,
				    geographicMeridian = 2.0,
				    expected = -1.0;

				expect(calc.magneticDeclination(
						magneticSouthMeridian, geographicMeridian)).to.equal(expected);
			});

		}); // END :: magneticDeclination

		describe('w()', function () {

			it('computes correctly', function () {
				var westUp = 1.0,
				    eastDown = 2.0,
				    expected = -60.0;

				expect(calc.w(westUp, eastDown)).to.equal(expected);
			});

		}); // END :: w

		describe('e()', function () {

			it('computes correctly', function () {
				var eastUp = 1.0,
				    westDown = 2.0,
				    expected = -60.0;

				expect(calc.w(eastUp, westDown)).to.equal(expected);
			});

		}); // END :: e

		describe('correctedF()', function () {

			it('computes correctly', function () {
				var fmean = 1.0,
				    pierCorrection = 2.0,
				    expected = -1.0;

				expect(calc.correctedF(fmean, pierCorrection)).to.equal(expected);
			});

		}); // END :: correctedF


		describe('inclincation()', function () {

			it('computes correctly', function () {
				var southDown = 1.0,
				    southUp = 2.0,
				    northDown = 3.0,
				    northUp = 4.0,
				    expected = 2.5;

				expect(calc.inclination(
						southDown, southUp, northDown, northUp)).to.equal(expected);
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

		}); // END :: horizontalComponent

		describe('verticalComponent()', function () {

			it('computes correctly', function () {
				var correctedF = 4.2,
				    inclination = 0.0,
				    expected = 0.0;

				expect(calc.verticalComponent(
						correctedF, inclination)).to.equal(expected);
			});

		}); // END :: verticalComponent

		describe('s()', function () {

			it('computes correctly', function () {
				var southDown = 182.0,
				    northUp = 1.0,
				    expected = 60.0;

				expect(calc.s(southDown, northUp)).to.equal(expected);
			});

		}); // END :: s

		describe('n()', function () {

			it('computes correctly', function () {
				var northDown = 182.0,
				    southUp = 1.0,
				    expected = 60.0;

				expect(calc.n(northDown, southUp)).to.equal(expected);
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

		}); // END :: meanF


		describe('absoluteD()', function () {

			it('computes correctly', function () {
				var magneticDeclination = 1.0,
				    expected = 60.0;

				expect(calc.absoluteD(magneticDeclination)).to.equal(expected);
			});

		}); // END :: absoluteD

		describe('absoluteH()', function () {

			it('computes correctly', function () {
				var horizontalCompnent = 1.0,
				    expected = 1.0;

				expect(calc.absoluteH(horizontalCompnent)).to.equal(expected);
			});

		}); // END :: absoluteH

		describe('absoluteZ()', function () {

			it('computes correctly', function () {
				var verticalComponent = 1.0,
				    expected = 1.0;

				expect(calc.absoluteZ(verticalComponent)).to.equal(expected);
			});

		}); // END :: absoluteZ

		describe('scaleValue()', function () {

			it('computes correctly', function () {
				var absoluteH = BaselineCalculator.SCALE_VALUE_COEFFIFIENT,
				    expected = 1.0;

				expect(calc.scaleValue(absoluteH)).to.equal(expected);
			});

		}); // END :: scaleValue


		describe('computedH()', function () {

			it('computes correctly', function () {
				var absoluteH = 1.0,
				    expected = 1.0;

				expect(calc.computedH(absoluteH)).to.equal(expected);
			});

		}); // END :: computedH

		describe('computedE()', function () {

			it('computes correctly', function () {
				var absoluteE = 1.0,
				    scaleValue = 1.0,
				    expected = 1.0;

				expect(calc.computedE(absoluteE, scaleValue)).to.equal(expected);
			});

		}); // END :: computedE

		describe('computedZ()', function () {

			it('computes correctly', function () {
				var absoluteZ = 1.0,
				    expected = 1.0;

				expect(calc.computedZ(absoluteZ)).to.equal(expected);
			});

		}); // END :: computedZ

		describe('computedF()', function () {

			it('computes correctly', function () {
				var absoluteF = 1.0,
				    expected = 1.0;

				expect(calc.computedF(absoluteF)).to.equal(expected);
			});

		}); // END :: computedF


		describe('baselineD()', function () {

			it('computes correctly', function () {
				var magneticDeclination = 1.0,
				    computedE = 50.0,
				    expected = 10.0;

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
