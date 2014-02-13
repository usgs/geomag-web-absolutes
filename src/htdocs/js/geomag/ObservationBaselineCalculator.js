/* global define */

define([
	'geomag/BaselineCalculator',
	'geomag/Measurement'
], function (
	BaselineCalculator,
	Measurement
) {
	'use strict';


	var ObservationBaselineCalculator = function (options) {
		options = options || {};
		this.calculator = options.calculator || new BaselineCalculator();
		this.observation = options.observation;
	};

	// extend BaselineCalculator class
	ObservationBaselineCalculator.prototype = Object.create({


		/**
		 * meanMark
		 *
		 * @param {Object} reading, an observation reading
		 *
		 * @return {Number} meanMark
		 */
		meanMark: function (reading) {
			var measurements = reading.getMeasurements();

			// measurement.type
			return this.calculator._mean(
					measurements[Measurement.FIRST_MARK_UP][0].get('angle'),
					measurements[Measurement.FIRST_MARK_DOWN][0].get('angle'),
					measurements[Measurement.SECOND_MARK_UP][0].get('angle'),
					measurements[Measurement.SECOND_MARK_DOWN][0].get('angle')
			);
		},
		meanH: function (reading) {
			return this._getMeanValue(reading, 'h');
		},
		meanE: function (reading) {
			return this._getMeanValue(reading, 'e');
		},
		meanZ: function (reading) {
			return this._getMeanValue(reading, 'z');
		},
		meanF: function (reading) {
			return this._getMeanValue(reading, 'f');
		},

		/**
		 * magneticSouthMeridian
		 *
		 * @param {Object} reading, an observation reading
		 *
		 * @return {Number} magneticSouthMeridian
		 */
		magneticSouthMeridian: function (reading) {
			var measurements = reading.getMeasurements();

			// measurement.type
			return this.calculator.magneticSouthMeridian(
					measurements[Measurement.WEST_DOWN][0].get('angle'),
					measurements[Measurement.WEST_UP][0].get('angle'),
					measurements[Measurement.EAST_DOWN][0].get('angle'),
					measurements[Measurement.EAST_UP][0].get('angle')
			);
		},

		/**
		 * magneticAzimuthMark
		 *
		 * @param {Object} reading, an observation reading
		 *
		 * @return {Number} magneticAzimuthMark
		 */
		magneticAzimuthMark: function (reading) {
			var measurements = reading.getMeasurements(),
			    meanMark = null;

			meanMark = (
					measurements[Measurement.FIRST_MARK_UP][0].get('angle') +
					measurements[Measurement.FIRST_MARK_DOWN][0].get('angle') +
					measurements[Measurement.SECOND_MARK_UP][0].get('angle') +
					measurements[Measurement.SECOND_MARK_DOWN][0].get('angle')) / 4;

			// meanMark = mark1/mark2(up/down) / 4
			return this.calculator.magneticAzimuthMark(
					meanMark,
					this.magneticSouthMeridian(reading)
			);
		},


		/**
		 * geographicMeridian
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 *
		 * @return {Number} geographicMeridian
		 */
		geographicMeridian: function (observatory, reading) {
			// measurement.type (markup1, markup2)
			var measurements = reading.getMeasurements();

			return this.calculator.geographicMeridian(
					measurements[Measurement.FIRST_MARK_UP][0].get('angle'),
					measurements[Measurement.SECOND_MARK_UP][0].get('angle'),
					this.trueAzimuthOfMark(observatory)
			);
		},


		/**
		 * magneticDeclination
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 *
		 * @return {Number} magneticDeclination
		 */
		magneticDeclination: function (observatory, reading) {
			return this.calculator.magneticDeclination(
					this.magneticSouthMeridian(reading),
					this.geographicMeridian(observatory, reading)
			);
		},

		/**
		 * w
		 *
		 * @param {Object} reading, an observation reading
		 *
		 * @return {Number} w
		 */
		w: function (reading) {
			var measurements = reading.getMeasurements();

			return this.calculator.w(
					measurements[Measurement.WEST_UP][0].get('angle'),
					measurements[Measurement.EAST_DOWN][0].get('angle')
			);
		},
		westUpMinusEastDown: function (reading){
			return this.w(reading);
		},

		/**
		 * e
		 *
		 * @param {Object} reading, an observation reading
		 *
		 * @return {Number} e
		 */
		e: function (reading) {
			var measurements = reading.getMeasurements();

			return this.calculator.e(
					measurements[Measurement.EAST_UP][0].get('angle'),
					measurements[Measurement.WEST_DOWN][0].get('angle')
			);
		},
		eastUpMinusWestDown: function (reading){
			return this.e(reading);
		},

		/**
		 * correctedF
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 *
		 * @return {Number} correctedF
		 */
		correctedF: function (observatory, reading) {
			// dont need to check each measurement, use ns(ud) (value will be null for measurement values that don't matter)

			return this.calculator.correctedF(
					this._getMeanValue(reading, 'f'),
					this.pierCorrection(observatory)
			);
		},

		/**
		 * inclination
		 *
		 * @param {Object} reading, an observation reading
		 *
		 * @return {Number} inclination
		 */
		inclination: function (reading) {
			var measurements = reading.getMeasurements();

			// measurement.type
			return this.calculator.inclination(
					measurements[Measurement.SOUTH_DOWN][0].get('angle'),
					measurements[Measurement.SOUTH_UP][0].get('angle'),
					measurements[Measurement.NORTH_DOWN][0].get('angle'),
					measurements[Measurement.NORTH_UP][0].get('angle')
			);
		},

		/**
		 * horizontalComponent
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 *
		 * @return {Number} horizontalComponent
		 */
		horizontalComponent: function (observatory, reading) {
			return this.calculator.horizontalComponent(
					this.correctedF(observatory, reading),
					this.inclination(reading)
			);
		},

		/**
		 * verticalComponent
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 *
		 * @return {Number} verticalComponent
		 */
		verticalComponent: function (observatory, reading) {
			return this.calculator.verticalComponent(
					this.correctedF(observatory, reading),
					this.inclination(reading)
			);
		},

		/**
		 * s
		 *
		 * @param {Object} reading, an observation reading
		 *
		 * @return {Number} s
		 */
		s: function (reading) {
			var measurements = reading.getMeasurements();

			return this.calculator.s(
					measurements[Measurement.SOUTH_DOWN][0].get('angle'),
					measurements[Measurement.NORTH_UP][0].get('angle')
			);
		},
		southDownMinusNorthUp: function (reading) {
			return this.s(reading);
		},

		/**
		 * n
		 *
		 * @param {Object} reading, an observation reading
		 *
		 * @return {Number} n
		 */
		n: function (reading) {
			var measurements = reading.getMeasurements();

			return this.calculator.n(
					measurements[Measurement.NORTH_DOWN][0].get('angle'),
					measurements[Measurement.SOUTH_UP][0].get('angle')
			);
		},
		northDownMinusSouthUp: function (reading) {
			return this.n(reading);
		},
		/**
		 * scaleValue
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 *
		 * @return {Number} scaleValue
		 */
		scaleValue: function (observatory, reading) {
			return this.calculator.scaleValue(
					this.horizontalComponent(observatory, reading)
			);
		},

		/**
		 * computedE
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 *
		 * @return {Number} computedE
		 */
		computedE: function (observatory, reading) {
			return this.calculator.computedE(
					this._getMeanValue(reading, 'e'),
					this.scaleValue(observatory, reading)
			);
		},

		/**
		 * baselineD
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 *
		 * @return {Number} baselineD
		 */
		baselineD: function (observatory, reading) {
			return this.calculator.baselineD(
					this.magneticDeclination(observatory, reading),
					this.computedE(observatory, reading)
			);
		},

		/**
		 * baselineH
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 *
		 * @return {Number} baselineH
		 */
		baselineH: function (observatory, reading) {
			return this.calculator.baselineH(
					this.horizontalComponent(observatory, reading),
					this._getMeanValue(reading, 'h')
			);
		},

		/**
		 * baselineZ
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 *
		 * @return {Number} baselineZ
		 */
		baselineZ: function (observatory, reading) {
			return this.calculator.baselineZ(
					this.verticalComponent(observatory, reading),
					this._getMeanValue(reading, 'z')
			);
		},

		/**
		 * d
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 *
		 * @return {Number} d
		 */
		d: function (observatory, reading) {
			return this.calculator.d(
					this.baselineD(observatory, reading),
					this.scaleValue(observatory, reading)
			); //
		},

		/**
		 * pierCorrection
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 *
		 * @return {Number} pierCorrection
		 */
		pierCorrection: function (observatory) {
			return observatory.get('piers').getSelected().get('correction');
		},

		/**
		 * trueAzimuthOfMark
		 *
		 * @param {Object} obsevation, an observation from an observatory
		 *
		 * @return {Number} trueAzimuthOfMark
		 */
		trueAzimuthOfMark: function (observatory) {
			return observatory.get('piers').getSelected().get('marks').getSelected().get('azimuth');
		},

		/**
		 * _getMeanValue
		 *
		 * @param {Object} reading, an observation reading
		 * @param {String} channel, a measurement channel
		 *
		 * @return {Number} mean of the selected channel
		 */
		_getMeanValue: function (reading, channel) {
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
				return null;
			}

			return total / count;
		}

	});

	return ObservationBaselineCalculator;

});
