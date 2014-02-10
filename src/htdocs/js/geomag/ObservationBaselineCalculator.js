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
		this.calculator = options.calculator || new BaselineCalculator();
		this.observation = options.observation;
	};

	// extend BaselineCalculator class
	ObservationBaselineCalculator.prototype = Object.create({


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
		geographicMeridian: function (observation, reading) {
			// measurement.type (markup1, markup2)
			var measurements = reading.getMeasurements();

			return this.calculator.geographicMeridian(
					measurements[Measurement.FIRST_MARK_UP][0].get('angle'),
					measurements[Measurement.SECOND_MARK_UP][0].get('angle'),
					this.trueAzimuthOfMark(observation)
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
		magneticDeclination: function (observation, reading) {
			return this.calculator.magneticDeclination(
					this.magneticSouthMeridian(reading),
					this.geographicMeridian(observation, reading)
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

		/**
		 * correctedF
		 * 
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 * 
		 * @return {Number} correctedF
		 */
		correctedF: function (observation, reading) {
			// dont need to check each measurement, use ns(ud) (value will be null for measurement values that don't matter)

			return this.calculator.correctedF(
					this._getMeanValue(reading, 'f'),
					this.pierCorrection(observation)
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
		horizontalComponent: function (observation, reading) {
			return this.calculator.horizontalComponent(
					this.correctedF(observation, reading),
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
		verticalComponent: function (observation, reading) {
			return this.calculator.verticalComponent(
					this.correctedF(observation, reading),
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

		/**
		 * scaleValue
		 * 
		 * @param {Object} obsevation, an observation from an observatory
		 * @param {Object} reading, a reading from an observation
		 * 
		 * @return {Number} scaleValue
		 */
		scaleValue: function (observation, reading) {
			return this.calculator.scaleValue(
					this.horizontalComponent(observation, reading)
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
		computedE: function (observation, reading) {
			return this.calculator.computedE(
					this._getMeanValue(reading, 'e'),
					this.scaleValue(observation, reading)
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
		baselineD: function (observation, reading) {
			return this.calculator.baselineD(
					this.magneticDeclination(observation, reading),
					this.computedE(observation, reading)
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
		baselineH: function (observation, reading) {
			return this.calculator.baselineH(
					this.horizontalComponent(observation, reading),
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
		baselineZ: function (observation, reading) {
			return this.calculator.baselineZ(
					this.verticalComponent(observation, reading),
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
		d: function (observation, reading) {
			return this.calculator.d(
					this.baselineD(observation, reading),
					this.scaleValue(observation, reading)
			); // 
		},

		/**
		 * pierCorrection
		 * 
		 * @param {Object} obsevation, an observation from an observatory
		 * 
		 * @return {Number} pierCorrection
		 */
		pierCorrection: function (observation) {
			return observation.get('pierCorrection');
		},

		/**
		 * trueAzimuthOfMark
		 * 
		 * @param {Object} obsevation, an observation from an observatory
		 * 
		 * @return {Number} trueAzimuthOfMark
		 */
		trueAzimuthOfMark: function (observation) {
			return observation.get('trueAzimuthOfMark');
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
			    values = [],
			    mean = null;

			if (measurements !== null) {

				measurements = measurements.data();

				for (var i = 0; i < measurements.length; i++) {

					if (channel === 'h' && measurements[i].get('h') !== null) {
						values.push(measurements[i].get('h'));
					} else if (channel === 'z' && measurements[i].get('z') !== null) {
						values.push(measurements[i].get('z'));
					} else if (channel === 'e' && measurements[i].get('e') !== null) {
						values.push(measurements[i].get('e'));
					} else if (channel === 'f' && measurements[i].get('f') !== null) {
						values.push(measurements[i].get('f'));
					}
				}

				for (var x = 0; x < values.length; x++) {
					mean += values[x];
				}
			}

			return mean / values.length;
		}

	});

	return ObservationBaselineCalculator;

});