/* global define, describe, it */

define([
	'chai',
	'geomag/ObservationBaselineCalculator',
	'geomag/BaselineCalculator',
	'geomag/Reading',
	'geomag/Measurement',
	'geomag/Observation',
	'mvc/Collection'
], function (
	chai,
	ObservationBaselineCalculator,
	BaselineCalculator,
	Reading,
	Measurement,
	Observation,
	Collection
) {

	'use strict';

	var expect = chai.expect;

	var calc = new ObservationBaselineCalculator({
			calculator: new BaselineCalculator(),
			pierCorrection: -23.1,
			trueAzimuthOfMark: 199.1383
	});

	// data from BOU20132861836.bns
	var meas1 = new Measurement({
			'id': 1,
			'type': Measurement.FIRST_MARK_UP,
			'time': null,
			'angle': 10.332222222222223,// 10.3322, // 10,19,56
			'h': 20000.8,
			'e': -300.8,
			'z': 45000.8,
			'f': 55000.6
	});

	// data from BOU20132861836.bns
	var meas2 = new Measurement({
			'id': 2,
			'type': Measurement.FIRST_MARK_DOWN,
			'time': null,
			'angle': 190.3363888888889,// 190.3364, // 190 20 11
			'h': 20000.7,
			'e': -300.7,
			'z': 45000.7,
			'f': 55000.5
	});

	// data from BOU20132861836.bns
	var meas3 = new Measurement({'id': 3,
			'type': Measurement.WEST_DOWN,
			'time': 183639,
			'angle': 270.15749999999997,// 270.1575, // 270 9 27
			'h': 20000.6,
			'e': -269.88,
			'z': 45000.6,
			'f': 55000.4
	});

	// data from BOU20132861836.bns
	var meas4 = new Measurement({
			'id': 4,
			'type': Measurement.EAST_DOWN,
			'time': 183733,
			'angle': 90.22194444444445,// 90.2219, // 90 13 19
			'h': 20000.5,
			'e': -270.13,
			'z': 45000.5,
			'f': 55000.3
	});

	// data from BOU20132861836.bns
	var meas5 = new Measurement({
			'id': 5,
			'type': Measurement.WEST_UP,
			'time': 183820,
			'angle': 90.2936111111111,// 90.2936, // 90 17 37
			'h': 20000.4,
			'e': -269.38,
			'z': 45000.4,
			'f': 55000.2
	});

	// data from BOU20132861836.bns
	var meas6 = new Measurement({
			'id': 6,
			'type': Measurement.EAST_UP,
			'time': 183916,
			'angle': 270.2547222222222,// 270.2547, // 270 15 17
			'h': 20000.3,
			'e': -269.37,
			'z': 45000.3,
			'f': 55000.1
	});

	// data from BOU20132861836.bns
	var meas7 = new Measurement({
			'id': 7,
			'type': Measurement.SECOND_MARK_UP,
			'time': null,
			'angle': 10.330555555555556,// 10.3306, // 10 19 50
			'h': 20000.2,
			'e': -300.6,
			'z': 45000.2,
			'f': 55000.0
	});

	// data from BOU20132861836.bns
	var meas8 = new Measurement({
			'id': 8,
			'type': Measurement.SECOND_MARK_DOWN,
			'time': null,
			'angle': 190.33972222222224,// 190.3369, // 190 20 23
			'h': 20000.1,
			'e': -300.5,
			'z': 45000.1,
			'f': 55000.9
	});

	// data from BOU20132861836.bns
	var meas9 = new Measurement({
			'id': 9,
			'type': Measurement.SOUTH_DOWN,
			'time': 184200,
			'angle': 246.67388888888888,// 246.6739, // 246 40 26
			'h': 20821.17,
			'e': -300.4,
			'z': 47753.38,
			'f': 52628.85
	});

	// data from BOU20132861836.bns
	var measA = new Measurement({
			'id': 10,
			'type': Measurement.NORTH_UP,
			'time': 184247,
			'angle': 66.66916666666667,// 66.6692, // 66 40 9
			'h': 20821.50,
			'e': -300.3,
			'z': 47753.70,
			'f': 52629.24
	});

	// data from BOU20132861836.bns
	var measB = new Measurement({
			'id': 11,
			'type': Measurement.SOUTH_UP,
			'time': 184347,
			'angle': 113.34722222222221,// 113.3472, // 113 20 50
			'h': 20821.03,
			'e': -300.2,
			'z': 47753.68,
			'f': 52629.07
	});

	// data from BOU20132861836.bns
	var measC = new Measurement({
			'id': 12,
			'type': Measurement.NORTH_DOWN,
			'time': 184513,
			'angle': 293.35361111111115,// 293.3536, // 293 21 13
			'h': 20820.68,
			'e': -300.1,
			'z': 47754.02,
			'f': 52629.28
	});

	// data from BOU20132861836.bns
	var READING = new Reading({
		'id': 1,
		'set_number': 1,
		'declination_valid': true,
		'horizontal_intensity_valid': true,
		'vertical_intensity_valid': true,
		'observer': 'Eddie',
		'annotation': 'This is a test',
		'measurements': new Collection([
			meas1, meas2, meas3, meas4, meas5, meas6,
			meas7, meas8, meas9, measA, measB, measC
		])
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

		describe('magneticAzimuthMark()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				expect(calc.magneticAzimuthMark(READING)).to.be.closeTo(10.1021, 0.01);
			});

		}); // END :: magneticAzimuthMark

		describe('geographicMeridian()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				expect(calc.geographicMeridian(READING))
						.to.be.closeTo(-188.8069, 0.001);
			});

		}); // END :: geographicMeridian

		describe('magneticDeclination()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				expect(calc.magneticDeclination(READING)).to.be.closeTo(9.0362, 0.01);
			});

		}); // END ::  magneticDeclination

		describe('westUpMinusEastDown()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 0.07166666666666667;   // 4.3' converted to degrees
				expect(calc.westUpMinusEastDown(READING))
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

		describe('fCorrected()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				expect(calc.fCorrected(READING)).to.be.closeTo(52606.01, 0.00001);
			});

		}); // END :: corrected F

		describe('inclination()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				expect(calc.inclination(READING)).to.be.closeTo(66.6606, 0.001);
			});

		}); // END :: inclination

		describe('horizontalComponent()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				expect(calc.horizontalComponent(READING))
						.to.be.closeTo(20841.33, 0.01);
			});

		}); // END :: horiztonal Component

		describe('verticalComponent()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				expect(calc.verticalComponent(READING)).to.be.closeTo(48301.46, 0.01);
			});

		}); // END :: verticalComponent

		describe('southDownMinusNorthUp()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 0.0046666;    // 0 0.28 converted to degrees
				expect(calc.southDownMinusNorthUp(READING))
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


		describe('scaleValue()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 0.16494853255526;   // 0.16494853255526
				expect(calc.scaleValue(READING)).to.be.closeTo(expected, 0.01);
			});

		}); // END :: scaleValue

		describe('dComputed()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = -0.7413333333333333;// 464.5604 min, convert to degrees
				expect(calc.dComputed(READING)).to.be.closeTo(expected, 0.0001);
			});

		}); // END :: dComputed

		describe('dBaseline()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 9.780333333333335;  // 586.66 min, converted to degrees
				expect(calc.dBaseline(READING)).to.be.closeTo(expected, 0.0001);
			});

		}); // END :: dBaseline


		describe('hBaseline()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				expect(calc.hBaseline(READING)).to.be.closeTo(20.23, 0.01);
			});

		}); // END :: hBaseline


		describe('zBaseline()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				expect(calc.zBaseline(READING)).to.be.closeTo(547.76, 0.01);
			});

		}); // END :: zBaseline


		describe('eBaseline()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 3557.5945472773902;   // 3556.6245477416474
				expect(calc.eBaseline(READING)).to.be.closeTo(expected, 0.1);
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
});
