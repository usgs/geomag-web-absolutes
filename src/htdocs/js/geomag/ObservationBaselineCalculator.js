/* global define */

define([
	'mvc/Model',
	'util/Util',

	'geomag/BaselineCalculator',
	'geomag/Measurement'
], function (
	Model,
	Util,

	BaselineCalculator,
	Measurement
) {
	'use strict';


	var DEFAULTS = {
		calculator: new BaselineCalculator(),
		// model options
		pierCorrection: 0,
		trueAzimuthOfMark: 0
	};


	var ObservationBaselineCalculator = function (options) {
		options = Util.extend({}, DEFAULTS, options);
		// keep calculator outside model
		this._calculator = options.calculator;
		delete options.calculator;
		// initialize model
		Model.call(this, options);
	};


	// extend Model class
	ObservationBaselineCalculator.prototype = Object.create(Model.prototype);

	/**
	 * meanMark
	 *
	 * @param {Object} reading, an observation reading
	 *
	 * @return {Number} meanMark
	 */
	ObservationBaselineCalculator.prototype.meanMark = function (reading) {
		var measurements = reading.getMeasurements();

		// measurement.type
		return this._calculator._mean(
				measurements[Measurement.FIRST_MARK_UP][0].get('angle'),
				measurements[Measurement.FIRST_MARK_DOWN][0].get('angle'),
				measurements[Measurement.SECOND_MARK_UP][0].get('angle'),
				measurements[Measurement.SECOND_MARK_DOWN][0].get('angle')
		);
	};

	ObservationBaselineCalculator.prototype.meanH = function (reading) {
		var measurements = reading.getMeasurements();

		return this._calculator._mean(
			measurements[Measurement.SOUTH_DOWN][0].get('h'),
			measurements[Measurement.NORTH_UP][0].get('h'),
			measurements[Measurement.SOUTH_UP][0].get('h'),
			measurements[Measurement.NORTH_DOWN][0].get('h')
		);
	};
	ObservationBaselineCalculator.prototype.meanE = function (reading) {
		var measurements = reading.getMeasurements();

		return this._calculator._mean(
			measurements[Measurement.WEST_DOWN][0].get('e'),
			measurements[Measurement.EAST_DOWN][0].get('e'),
			measurements[Measurement.WEST_UP][0].get('e'),
			measurements[Measurement.EAST_UP][0].get('e')
		);
	};
	ObservationBaselineCalculator.prototype.meanZ = function (reading) {
		var measurements = reading.getMeasurements();

		return this._calculator._mean(
			measurements[Measurement.SOUTH_DOWN][0].get('z'),
			measurements[Measurement.NORTH_UP][0].get('z'),
			measurements[Measurement.SOUTH_UP][0].get('z'),
			measurements[Measurement.NORTH_DOWN][0].get('z')
		);
	};
	ObservationBaselineCalculator.prototype.meanF = function (reading) {
		var measurements = reading.getMeasurements();

		return this._calculator._mean(
			measurements[Measurement.SOUTH_DOWN][0].get('f'),
			measurements[Measurement.NORTH_UP][0].get('f'),
			measurements[Measurement.SOUTH_UP][0].get('f'),
			measurements[Measurement.NORTH_DOWN][0].get('f')
		);
	};

	/**
	 * magneticSouthMeridian
	 *
	 * @param {Object} reading, an observation reading
	 *
	 * @return {Number} magneticSouthMeridian
	 */
	ObservationBaselineCalculator.prototype.magneticSouthMeridian =
			function (reading) {
		var measurements = reading.getMeasurements();

		// measurement.type
		return this._calculator.magneticSouthMeridian(
				measurements[Measurement.WEST_DOWN][0].get('angle'),
				measurements[Measurement.WEST_UP][0].get('angle'),
				measurements[Measurement.EAST_DOWN][0].get('angle'),
				measurements[Measurement.EAST_UP][0].get('angle')
		);
	};

	/**
	 * magneticAzimuthMark
	 *
	 * @param {Object} reading, an observation reading
	 *
	 * @return {Number} magneticAzimuthMark
	 */
	ObservationBaselineCalculator.prototype.magneticAzimuthMark =
			function (reading) {
		var measurements = reading.getMeasurements(),
		    meanMark = null;

		meanMark = (
				measurements[Measurement.FIRST_MARK_UP][0].get('angle') +
				measurements[Measurement.FIRST_MARK_DOWN][0].get('angle') +
				measurements[Measurement.SECOND_MARK_UP][0].get('angle') +
				measurements[Measurement.SECOND_MARK_DOWN][0].get('angle')) / 4;

		// meanMark = mark1/mark2(up/down) / 4
		return this._calculator.magneticAzimuthMark(
				meanMark,
				this.magneticSouthMeridian(reading)
		);
	};


	/**
	 * geographicMeridian
	 *
	 * @param {Object} reading, a reading from an observation
	 *
	 * @return {Number} geographicMeridian
	 */
	ObservationBaselineCalculator.prototype.geographicMeridian =
			function (reading) {
		// measurement.type (markup1, markup2)
		var measurements = reading.getMeasurements();

		return this._calculator.geographicMeridian(
				measurements[Measurement.FIRST_MARK_UP][0].get('angle'),
				measurements[Measurement.SECOND_MARK_UP][0].get('angle'),
				this.trueAzimuthOfMark()
		);
	};


	/**
	 * magneticDeclination
	 *
	 * @param {Object} reading, a reading from an observation
	 *
	 * @return {Number} magneticDeclination
	 */
	ObservationBaselineCalculator.prototype.magneticDeclination =
			function (reading) {
		return this._calculator.magneticDeclination(
				this.magneticSouthMeridian(reading),
				this.geographicMeridian(reading),
				reading.get('declination_shift')
		);
	};

	/**
	 * w
	 *
	 * @param {Object} reading, an observation reading
	 *
	 * @return {Number} w
	 */
	ObservationBaselineCalculator.prototype.westUpMinusEastDown =
			function (reading) {
		var measurements = reading.getMeasurements();

		return this._calculator.westUpMinusEastDown(
				measurements[Measurement.WEST_UP][0].get('angle'),
				measurements[Measurement.EAST_DOWN][0].get('angle')
		);
	};

	/**
	 * e
	 *
	 * @param {Object} reading, an observation reading
	 *
	 * @return {Number} e
	 */
	ObservationBaselineCalculator.prototype.eastUpMinusWestDown =
			function (reading){
		var measurements = reading.getMeasurements();

		return this._calculator.eastUpMinusWestDown(
				measurements[Measurement.EAST_UP][0].get('angle'),
				measurements[Measurement.WEST_DOWN][0].get('angle')
		);
	};

	/**
	 * F Corrected
	 *
	 * @param {Object} reading, a reading from an observation
	 *
	 * @return {Number} fCorrected
	 */
	ObservationBaselineCalculator.prototype.fCorrected =
			function (reading) {
		// dont need to check each measurement, use ns(ud)
		// (value will be null for measurement values that don't matter)

		return this._calculator.fCorrected(
				this.meanF(reading),
				this.pierCorrection()
		);
	};

	/**
	 * inclination
	 *
	 * @param {Object} reading, an observation reading
	 *
	 * @return {Number} inclination
	 */
	ObservationBaselineCalculator.prototype.inclination = function (reading) {
		var measurements = reading.getMeasurements();

		// measurement.type
		return this._calculator.inclination(
				measurements[Measurement.SOUTH_DOWN][0].get('angle'),
				measurements[Measurement.SOUTH_UP][0].get('angle'),
				measurements[Measurement.NORTH_DOWN][0].get('angle'),
				measurements[Measurement.NORTH_UP][0].get('angle')
		);
	};

	/**
	 * horizontalComponent
	 *
	 * @param {Object} reading, a reading from an observation
	 *
	 * @return {Number} horizontalComponent
	 */
	ObservationBaselineCalculator.prototype.horizontalComponent =
			function (reading) {
		return this._calculator.horizontalComponent(
				this.fCorrected(reading),
				this.inclination(reading)
		);
	};

	/**
	 * verticalComponent
	 *
	 * @param {Object} reading, a reading from an observation
	 *
	 * @return {Number} verticalComponent
	 */
	ObservationBaselineCalculator.prototype.verticalComponent =
			function (reading) {
		return this._calculator.verticalComponent(
				this.fCorrected(reading),
				this.inclination(reading)
		);
	};

	/**
	 * s
	 *
	 * @param {Object} reading, an observation reading
	 *
	 * @return {Number} s
	 */
	ObservationBaselineCalculator.prototype.southDownMinusNorthUp =
			function (reading) {
		var measurements = reading.getMeasurements();

		return this._calculator.southDownMinusNorthUp(
				measurements[Measurement.SOUTH_DOWN][0].get('angle'),
				measurements[Measurement.NORTH_UP][0].get('angle')
		);
	};

	/**
	 * n
	 *
	 * @param {Object} reading, an observation reading
	 *
	 * @return {Number} n
	 */
	ObservationBaselineCalculator.prototype.northDownMinusSouthUp =
			function (reading) {
		var measurements = reading.getMeasurements();

		return this._calculator.northDownMinusSouthUp(
				measurements[Measurement.NORTH_DOWN][0].get('angle'),
				measurements[Measurement.SOUTH_UP][0].get('angle')
		);
	};
	/**
	 * scaleValue
	 *
	 * @param {Object} reading, a reading from an observation
	 *
	 * @return {Number} scaleValue
	 */
	ObservationBaselineCalculator.prototype.scaleValue = function (reading) {
		return this._calculator.scaleValue(
				this.horizontalComponent(reading)
		);
	};

	/**
	 * D Computed
	 *
	 * @param {Object} reading, a reading from an observation
	 *
	 * @return {Number} computedE
	 */
	ObservationBaselineCalculator.prototype.dComputed = function (reading) {
		return this._calculator.dComputed(
				this.meanE(reading),
				this.scaleValue(reading)
		);
	};

	/**
	 * H Baseline
	 *
	 * @param {Object} reading, a reading from an observation
	 *
	 * @return {Number} hBaseline
	 */
	ObservationBaselineCalculator.prototype.hBaseline = function (reading) {
		return this._calculator.baselineH(
				this.horizontalComponent(reading),
				this.meanH(reading)
		);
	};

	/**
	 * E Baseline
	 *
	 * @param {Object} reading, a reading from an observation
	 *
	 * @return {Number} eBaseline
	 */
	ObservationBaselineCalculator.prototype.eBaseline = function (reading) {
		return this._calculator.eBaseline(
				this.eBaseline(reading),
				this.scaleValue(reading)
		); //
	};

	/**
	 * D Baseline
	 *
	 * @param {Object} reading, a reading from an observation
	 *
	 * @return {Number} dBaseline
	 */
	ObservationBaselineCalculator.prototype.dBaseline = function (reading) {
		return this._calculator.dBaseline(
				this.magneticDeclination(reading),
				this.dComputed(reading)
		);
	};

	/**
	 * Z Baseline
	 *
	 * @param {Object} reading, a reading from an observation
	 *
	 * @return {Number} zBaseline
	 */
	ObservationBaselineCalculator.prototype.zBaseline = function (reading) {
		return this._calculator.zBaseline(
				this.verticalComponent(reading),
				this.meanZ(reading)
		);
	};



	/**
	 * pierCorrection
	 *
	 * @return {Number} pierCorrection
	 */
	ObservationBaselineCalculator.prototype.pierCorrection = function () {
		return this.get('pierCorrection');
	};

	/**
	 * trueAzimuthOfMark
	 *
	 * @return {Number} trueAzimuthOfMark
	 */
	ObservationBaselineCalculator.prototype.trueAzimuthOfMark = function () {
		return this.get('trueAzimuthOfMark');
	};

	/**
	 * getMeanValue
	 *
	 * @param {Object} reading, an observation reading
	 * @param {String} channel, a measurement channel
	 *
	 * @return {Number} mean of the selected channel
	 */
	ObservationBaselineCalculator.prototype.getMeanValue =
			function (reading, channel) {
		var measurements = reading.get('measurements'),
		    total = 0,
		    count = 0,
		    value,
		    i, len;

		if (measurements !== null) {
			measurements = measurements.data();
			for (i = 0, len = measurements.length; i < len; i++) {
				value = measurements[i].get(channel);
				if (value !== null) {
					total += value;
					count++;
				}
			}
		}

		if (count === 0) {
			return 0;
		}

		return total / count;
	};

	ObservationBaselineCalculator.prototype.getStats = function (data) {
		var mean = this._calculator._mean.apply(this._calculator, data),
		    min = Math.min.apply(Math, data),
		    max = Math.max.apply(Math, data),
		    i = null,
		    len = null,
		    variance = 0,
		    difference = null;

		for (i = 0, len = data.length; i < len; i++) {
			difference = mean - data[i];
			variance += difference * difference;
		}
		if (len === 0) {
			return {
				mean:NaN,
				min:NaN,
				max:NaN,
				stdDev: NaN
			};
		}
		variance /= len;

		return {
			mean: mean,
			min: min,
			max: max,
			stdDev: Math.sqrt(variance)
		};
	};

	return ObservationBaselineCalculator;

});
