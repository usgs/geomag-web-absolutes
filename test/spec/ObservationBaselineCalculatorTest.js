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

	var expect = chai.expect,
	    EPSILON = 0.01;

	var calc = new ObservationBaselineCalculator({
			calculator: new BaselineCalculator(),
			observation: new Observation()
	});

	// data from BOU20132861836.bns
	var meas1 = new Measurement({
			'id': 1,
			'type': Measurement.FIRST_MARK_UP,
			'time': null,
			'angle': 10.332222222222223,// 10.3322, // 10,19,56
			'h': null,
			'e': null,
			'z': null,
			'f': null
	});

	// data from BOU20132861836.bns
	var meas2 = new Measurement({
			'id': 2,
			'type': Measurement.FIRST_MARK_DOWN,
			'time': null,
			'angle': 190.3363888888889,// 190.3364, // 190 20 11
			'h': null,
			'e': null,
			'z': null,
			'f': null
	});

	// data from BOU20132861836.bns
	var meas3 = new Measurement({'id': 3,
			'type': Measurement.WEST_DOWN,
			'time': 183639,
			'angle': 270.15749999999997,// 270.1575, // 270 9 27
			'h': null,
			'e': -269.88,
			'z': null,
			'f': null
	});

	// data from BOU20132861836.bns
	var meas4 = new Measurement({
			'id': 4,
			'type': Measurement.EAST_DOWN,
			'time': 183733,
			'angle': 90.22194444444445,// 90.2219, // 90 13 19
			'h': null,
			'e': -270.13,
			'z': null,
			'f':  null
	});

	// data from BOU20132861836.bns
	var meas5 = new Measurement({
			'id': 5,
			'type': Measurement.WEST_UP,
			'time': 183820,
			'angle': 90.2936111111111,// 90.2936, // 90 17 37
			'h': null,
			'e': -269.38,
			'z': null,
			'f': null
	});

	// data from BOU20132861836.bns
	var meas6 = new Measurement({
			'id': 6,
			'type': Measurement.EAST_UP,
			'time': 183916,
			'angle': 270.2547222222222,// 270.2547, // 270 15 17
			'h': null,
			'e': -269.37,
			'z': null,
			'f': null
	});

	// data from BOU20132861836.bns
	var meas7 = new Measurement({
			'id': 7,
			'type': Measurement.SECOND_MARK_UP,
			'time': null,
			'angle': 10.330555555555556,// 10.3306, // 10 19 50
			'h': null,
			'e': null,
			'z': null,
			'f': null
	});

	// data from BOU20132861836.bns
	var meas8 = new Measurement({
			'id': 8,
			'type': Measurement.SECOND_MARK_DOWN,
			'time': null,
			'angle': 190.33972222222224,// 190.3369, // 190 20 23
			'h': null,
			'e': null,
			'z': null,
			'f': null
	});

	// data from BOU20132861836.bns
	var meas9 = new Measurement({
			'id': 9,
			'type': Measurement.SOUTH_DOWN,
			'time': 184200,
			'angle': 246.67388888888888,// 246.6739, // 246 40 26
			'h': 20821.17,
			'e': null,
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
			'e': null,
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
			'e': null,
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
			'e': null,
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


	// data from BOU20132861836.bns
	var OBSERVATION = new Observation({
		'id': null,
		'begin': null,
		'end': null,
		'annotation': null,
		'readings': new Collection([READING]),
		'trueAzimuthOfMark': 199.1383,
		'pierCorrection': -23.1
	});


	describe('Unit tests for ObservationBaselineCalculator', function () {

		// --------------------------------------------------------------
		// Tests for API methods
		// --------------------------------------------------------------

		describe('magneticSouthMeridian()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {

				var expected = 180.2319;

				console.log(expected + ' | ' + calc.magneticSouthMeridian(READING));

				expect(Math.abs(calc.magneticSouthMeridian(READING) - expected)).to.be.below(EPSILON);

			});

		}); // END :: magneticSouthMeridian

		describe('magneticAzimuthMark()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 10.1021;

				console.log(expected + ' | ' + calc.magneticAzimuthMark(READING));

				expect(Math.abs(calc.magneticAzimuthMark(READING) - expected)).to.below(EPSILON);
			});

		}); // END :: magneticAzimuthMark

		describe('geographicMeridian()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = -188.8069;

				console.log(expected + ' | ' + calc.geographicMeridian(OBSERVATION, READING));

				expect(Math.abs(calc.geographicMeridian(OBSERVATION, READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: geographicMeridian

		describe('magneticDeclination()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 9.0362;

				console.log(expected + ' | ' + calc.magneticDeclination(OBSERVATION, READING));

				expect(Math.abs(calc.magneticDeclination(OBSERVATION, READING) - expected)).to.be.below(EPSILON);
			});

		}); // END ::  magneticDeclination

		describe('w()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 0.07166666666666667;   // 4.3' converted to degrees

				console.log(expected + ' | ' + calc.w(READING));

				expect(Math.abs(calc.w(READING) - expected)).to.be.below(EPSILON);
			});

		}); // END ::  w

		describe('e()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 0.09716666666666667;    // 5.83 converted to degrees

				console.log(expected + ' | ' + calc.e(READING));

				expect(Math.abs(calc.e(READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: e

		describe('correctedF()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 52606.01;

				console.log(expected + ' | ' + calc.correctedF(OBSERVATION, READING));

				expect(Math.abs(calc.correctedF(OBSERVATION, READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: corrected F

		describe('inclincation()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 66.6606;

				console.log(expected + ' | ' + calc.inclination(READING));

				expect(Math.abs(calc.inclination(READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: inclincation

		describe('horizontalComponent()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 20841.33; // 20841.33

				console.log(expected + ' | ' + calc.horizontalComponent(OBSERVATION, READING));

				expect(Math.abs(calc.horizontalComponent(OBSERVATION, READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: horiztonal Component

		describe('verticalComponent()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 48301.46; // 48301.46

				console.log(expected + ' | ' + calc.verticalComponent(OBSERVATION, READING));

				expect(Math.abs(calc.verticalComponent(OBSERVATION, READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: verticalComponent

		describe('s()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 0.0046666;    // 0 0.28 converted to degrees

				console.log(expected + ' | ' + calc.s(READING));

				expect(Math.abs(calc.s(READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: s


		describe('n()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 0.0063333;    //  0 0.38 converted to degrees

				console.log(expected + ' | ' + calc.n(READING));

				expect(Math.abs(calc.n(READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: n


		describe('scaleValue()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 0.16494853255526;   // 0.16494853255526

				console.log(expected + ' | ' + calc.scaleValue(OBSERVATION, READING));

				expect(Math.abs(calc.scaleValue(OBSERVATION, READING)) - expected).to.be.below(EPSILON);
			});

		}); // END :: scaleValue

		describe('computedE()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = -0.7413333333333333;  //  464.5604 min, converted to degrees

				console.log(expected + ' | ' + calc.computedE(OBSERVATION, READING));

				expect(Math.abs(calc.computedE(OBSERVATION, READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: computedE

		describe('baselineD()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 9.780333333333335;  // 586.66 min, converted to degrees

				console.log(expected + ' | ' + calc.baselineD(OBSERVATION, READING));

				expect(Math.abs(calc.baselineD(OBSERVATION, READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: baselineD


		describe('baselineH()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 20.23;

				console.log(expected + ' | ' + calc.baselineH(OBSERVATION, READING));

				expect(Math.abs(calc.baselineH(OBSERVATION, READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: baselineH


		describe('baselineZ()', function () {

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 547.76;

				console.log(expected + ' | ' + calc.baselineZ(OBSERVATION, READING));

				expect(Math.abs(calc.baselineZ(OBSERVATION, READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: baselineZ


		describe('d()', function () {

			// the rounding makes it too hard to have a better test
			var EPSILON = 0.1;

			it('computes correctly with data from BOU20132861836.bns', function () {
				var expected = 3557.5945472773902;   // 3556.6245477416474

				console.log(expected + ' | ' + calc.d(OBSERVATION, READING));

				expect(Math.abs(calc.d(OBSERVATION, READING) - expected)).to.be.below(EPSILON);
			});

		}); // END :: d



	}); // END :: Unit tests for BaselineCalculator
});