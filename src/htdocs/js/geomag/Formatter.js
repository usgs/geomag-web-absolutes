/*global define*/
define([
], function (
) {
	'use strict';


	var Formatter = {};

	Formatter._degreeUnits = function (degrees) {
		var buf = [];

		buf.push(degrees, '<span class="units">°</span>');

		return buf.join('');
	};

	Formatter._minuteUnits = function (minutes) {
		var buf = [];

		buf.push(minutes, '<span class="units">\'</span>');

		return buf.join('');
	};

	Formatter._ntUnits = function (nt_value) {
		var buf = [];

		buf.push(nt_value, '<span class="units">nT</span>');

		return buf.join('');
	};

	/**
	 * Decimal angle to degrees, minutes, seconds
	 *
	 * @param angle {Number} Decimal degrees
	 *
	 * @return {Array of Integers}
	 *
	 * @see MeasurementViewTest#degree_inversion_check
	 */
	Formatter.decimalToDms = function (angle) {
		var degrees = parseInt(angle, 10),
		    minutes = (angle - degrees) * 60,
		    seconds = Math.round((minutes - parseInt(minutes, 10)) * 60, 10);

		minutes = parseInt(minutes, 10);

		// Correct any errors due to floating point
		minutes += parseInt(seconds / 60, 10);
		seconds = seconds % 60;

		return [degrees, minutes, seconds];
	};

	/**
	 * Degrees, as an angle
	 *
	 * @param angle {Number} Decimal degrees
	 *
	 * @return formatted number with units
	 *    {Float} Angle degrees, 2 decimal places
	 */
	Formatter.degrees = function (angle) {
		var buf = [];

		buf.push(
				'<span class="deg">',
					this._degreeUnits(angle.toFixed(2)),
				'</span>');

		return buf.join('');
	};

	/**
	 * Degrees, as an angle, no rounding
	 *
	 * @param angle {Number} Decimal degrees
	 *
	 * @return formatted number with units
	 *    {Float} Angle degrees
	 */
	Formatter.degreesNoRounding = function (angle) {
		var buf = [];

		buf.push(
				'<span class="deg">',
					this._degreeUnits(angle),
				'</span>');

		return buf.join('');
	};

	/**
	 * Degrees Minutes, as an angle
	 *
	 * @param angle {Number} Decimal degrees
	 *
	 * @return 3 formatted numbers with units
	 *    {Float} Decimal angle degrees, 2 decimal places
	 *    {Int} Angle degrees
	 *    {Float} Decimal angle minutes, 2 decimal places
	 */
	Formatter.degreesMinutes = function (angle) {
		var buf = [],
		    degrees,
		    minutes;

		degrees = parseInt(angle, 10);
		minutes = (angle - degrees) * 60;

		buf.push(
				'<span class="deg">',
					this._degreeUnits(angle.toFixed(2)),
				'</span>',
				'<span class="repeat">',
					'<span class="deg">',
						this._degreeUnits(degrees),
					'</span>',
					'&nbsp;',
					'<span class="minutes">',
						this._minuteUnits(minutes.toFixed(2)),
					'</span>',
				'</span>');

		return buf.join('');
	};

	/**
	 * Degrees, minutes, seconds to decimal angle
	 *
	 * @param degs {Number}
	 *        The degree portion of the angle value. If this is a decimal,
	 *        then the fractional portion is converted to minutes.
	 * @param mins {Number}
	 *        The minutes portion of the angle value. If this is a decimal,
	 *        then the fractional portion is converted to seconds.
	 * @param secs {Integer}
	 *        The seconds portion of the angle value.
	 *
	 * @return {Decimal}
	 *        The decimal degrees for the given DMS value.
	 *
	 * @see MeasurementViewTest#degree_inversion_check
	 */
	Formatter.dmsToDecimal = function (degs, mins, secs) {
		return (parseInt(secs, 10) / 3600) + (parseFloat(mins) / 60) +
				parseFloat(degs);
	};

	/**
	 * Minutes, as an angle
	 *
	 * @param angle {Number} Decimal minutes
	 *
	 * @return formatted number with units
	 *    {Float} Angle minutes, 2 decimal places
	 */
	Formatter.minutes = function (angle_minutes) {
		var buf = [];

		buf.push(
				'<span class="minutes">',
					this._minuteUnits(angle_minutes.toFixed(2)),
				'</span>');

		return buf.join('');
	};

	/**
	 * nT (nano-teslas)
	 *
	 * @param {Number} nT
	 *
	 * @return formatted number with units
	 *    {Float} nT, 2 decimal places
	 */
	Formatter.nt = function (nt_value) {
		var buf = [];

		buf.push(
				'<span class="nano-teslas">',
					this._ntUnits(nt_value.toFixed(2)),
				'</span>');

		return buf.join('');
	};

	/**
	 * nT (nano-teslas), no rounding
	 *
	 * @param {Number} nT
	 *
	 * @return formatted number with units
	 *    {Float} nT
	 */
	Formatter.ntNoRounding = function (nt_value) {
		var buf = [];

		buf.push(
				'<span class="nano-teslas">',
					this._ntUnits(nt_value),
				'</span>');

		return buf.join('');
	};

	/**
	 * Parse a date string into an epoch timestamp.
	 *
	 * @param date {String}
	 *        UTC date in format 'YYYY-MM-DD'.
	 * @return {Number} corresponding epoch timestamp (for 00:00:00), or null.
	 */
	Formatter.parseDate = function(date) {
		if (date !== '') {
			var parts = date.split('-');
			return Date.UTC(parseInt(parts[0], 10),
					parseInt(parts[1], 10) - 1,
					parseInt(parts[2], 10));
		}
		return null;
	};

	/**
	 * String to Time
	 *
	 * @param time {String}
	 *      The formatted time string to parse. The date for the returned time
	 *      is inherited from the observation "begin" attribute.
	 *
	 * @return {Integer}
	 *      The millisecond timestamp since the epoch.
	 */
	Formatter.stringToTime = function (time) {
		var observationOffset = this._observation.get('begin');

		var timeString = time.replace(/[^\d]/g, ''),
		    offset = null;

		if (observationOffset) {
			observationOffset = new Date(observationOffset);
		} else {
			observationOffset = new Date();
		}

		if (timeString.length === 4) {
			// HHMM
			offset = Date.UTC(observationOffset.getUTCFullYear(),
					observationOffset.getUTCMonth(), observationOffset.getUTCDate(),
					parseInt(timeString.substr(0, 2), 10),
					parseInt(timeString.substr(2, 2), 10),
					0, 0);
		} else if (timeString.length === 5) {
			// HMMSS
			offset = Date.UTC(observationOffset.getUTCFullYear(),
					observationOffset.getUTCMonth(), observationOffset.getUTCDate(),
					parseInt(timeString.substr(0, 1), 10),
					parseInt(timeString.substr(1, 2), 10),
					parseInt(timeString.substr(3, 2), 10), 0);
		} else if (timeString.length === 6) {
			// HHMMSS
			offset = Date.UTC(observationOffset.getUTCFullYear(),
					observationOffset.getUTCMonth(), observationOffset.getUTCDate(),
					parseInt(timeString.substr(0, 2), 10),
					parseInt(timeString.substr(2, 2), 10),
					parseInt(timeString.substr(4, 2), 10), 0);
		}

		return offset;
	};

	/**
	 * Time to String
	 *
	 * @param time {Integer}
	 *      Timestamp (in milliseconds) since the epoch.
	 *
	 * @return {String}
	 *      A string formatted as "HH:mm:ss" representing the input time.
	 */
	Formatter.timeToString = function (time) {
		var offset = new Date(time),
		    h = offset.getUTCHours(),
		    m = offset.getUTCMinutes(),
		    s = offset.getUTCSeconds();

		return '' + (h<10?'0':'') + h + (m<10?':0':':') + m + (s<10?':0':':') + s;
	};

	return Formatter;
});
