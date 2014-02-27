/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/Formatter',
	'geomag/Measurement',
	'geomag/Validate'
], function (
	View,
	Util,

	Format,
	Measurement,
	Validate
) {
	'use strict';

	var DEFAULTS = {

	};

	var MEASUREMENT_TYPE_LABELS = {};
	MEASUREMENT_TYPE_LABELS[Measurement.FIRST_MARK_UP] = 'Mark Up';
	MEASUREMENT_TYPE_LABELS[Measurement.FIRST_MARK_DOWN] = 'Mark Down';

	MEASUREMENT_TYPE_LABELS[Measurement.WEST_DOWN] = 'West Down';
	MEASUREMENT_TYPE_LABELS[Measurement.EAST_DOWN] = 'East Down';
	MEASUREMENT_TYPE_LABELS[Measurement.WEST_UP] = 'West Up';
	MEASUREMENT_TYPE_LABELS[Measurement.EAST_UP] = 'East Up';

	MEASUREMENT_TYPE_LABELS[Measurement.SECOND_MARK_UP] = 'Mark Up';
	MEASUREMENT_TYPE_LABELS[Measurement.SECOND_MARK_DOWN] = 'Mark Down';

	MEASUREMENT_TYPE_LABELS[Measurement.SOUTH_DOWN] = 'South Down';
	MEASUREMENT_TYPE_LABELS[Measurement.NORTH_UP] = 'North Up';
	MEASUREMENT_TYPE_LABELS[Measurement.SOUTH_UP] = 'South Up';
	MEASUREMENT_TYPE_LABELS[Measurement.NORTH_DOWN] = 'North Down';


	var MeasurementView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, options);
	};
	MeasurementView.prototype = Object.create(View.prototype);

	MeasurementView.prototype.render = function () {
		var measurement = this._measurement,
		    time = measurement.get('time'),
		    angle = measurement.get('angle'),
		    timeString = null,
		    dms = null,
		    h = measurement.get('h'),
		    e = measurement.get('e'),
		    z = measurement.get('z'),
		    f = measurement.get('f');

		if (time === null) {
			timeString = '';
		} else {
			timeString = Format.time(time);
		}

		// Deconstruct the decimal degrees back to Dms
		// TODO :: Refactor to its own method for testability
		if (angle === null) {
			dms = ['', '', ''];
		} else {
			dms = Format.decimalToDms(angle);
		}

		this._timeInput.value = timeString;
		this._degreesInput.value = dms[0];
		this._minutesInput.value = dms[1];
		this._secondsInput.value = dms[2];

		this._hValue.innerHTML = (h === null ? '--' : Format.nanoteslas(h));
		this._eValue.innerHTML = (e === null ? '--' : Format.nanoteslas(e));
		this._zValue.innerHTML = (z === null ? '--' : Format.nanoteslas(z));
		this._fValue.innerHTML = (f === null ? '--' : Format.nanoteslas(f));
	};

	MeasurementView.prototype._initialize = function () {
		var _this = this,
		    onInputChange = null;

		this._measurement = this._options.measurement;
		this._observation = this._options.observation;

		this._el.innerHTML = [
			'<th scope="row" class="measurement-type">',
				MEASUREMENT_TYPE_LABELS[this._measurement.get('type')] || 'Type',
			'</th>',
			'<td class="measurement-time"><input type="text"/></td>',
			'<td class="measurement-degrees"><input type="text"/></td>',
			'<td class="measurement-minutes"><input type="text"/></td>',
			'<td class="measurement-seconds"><input type="text"/></td>',

			'<td class="measurement-h">--</td>',
			'<td class="measurement-e">--</td>',
			'<td class="measurement-z">--</td>',
			'<td class="measurement-f">--</td>'
		].join('');

		this._timeInput = this._el.querySelector('.measurement-time > input');
		this._degreesInput = this._el.querySelector('.measurement-degrees > input');
		this._minutesInput = this._el.querySelector('.measurement-minutes > input');
		this._secondsInput = this._el.querySelector('.measurement-seconds > input');

		this._hValue = this._el.querySelector('.measurement-h');
		this._eValue = this._el.querySelector('.measurement-e');
		this._zValue = this._el.querySelector('.measurement-z');
		this._fValue = this._el.querySelector('.measurement-f');


		onInputChange = function (/*evt*/) {
			var time = _this._timeInput.value,
			    degrees = _this._degreesInput.value,
			    minutes = _this._minutesInput.value,
			    seconds = _this._secondsInput.value,
			    isTimeChange;

			// is it the angle or time value that changed?
			isTimeChange = (this.parentElement.className.indexOf('time') !== -1) ?
					true : false;

			if (isTimeChange) {
				// validate time change
				_this._validateTime(time);
				// only set measurement values if they pass validation
				if (_this._measurement.get('time_error') === null) {
					// no errors on measurement, set measurement values
					_this._measurement.set({
						'time': Format.parseRelativeTime(time)
					});
				}
			} else {
				// validate angle change
				_this._validateAngle(degrees, minutes, seconds);
				if (_this._measurement.get('angle_error') === null) {
					// no errors on measurement, set measurement values
					_this._measurement.set({
						'angle': Format.dmsToDecimal(degrees, minutes, seconds)
					});
				}
			}




		};

		this._timeInput.addEventListener('blur', onInputChange);
		this._degreesInput.addEventListener('blur', onInputChange);
		this._minutesInput.addEventListener('blur', onInputChange);
		this._secondsInput.addEventListener('blur', onInputChange);

		this.render();
	};


	MeasurementView.prototype._validateTime = function (time) {
		var validTime = true,
				helpText, begin;

		// TIME
		begin = this._observation.get('begin');

		if (!Validate.validTime(time)) {
			validTime = false;
			helpText = 'Invalid Time. HH24:MI:SS';
		} else if (this._stringToTime(time) < begin) {
			validTime = false;
			helpText = 'Time is before start time.';
		}

		if (validTime) {
			this._measurement.set({'time_error': null});
		} else {
			this._measurement.set({'time_error': helpText});
		}

		this._updateErrorState(this._timeInput, validTime, helpText);
	};

	MeasurementView.prototype._validateAngle =
			function (degrees, minutes, seconds) {
		var validDegrees = true,
				validMinutes = true,
				validSeconds = true,
				helpText;

		// DEGREES
		if (!Validate.validDegrees(degrees)) {
			validDegrees = false;
			helpText = 'Invalid Degrees. Must be between, 0-360.';
		}

		if (validDegrees) {
			this._measurement.set({'degrees_error': null});
		} else {
			this._measurement.set({'degrees_error': helpText});
		}

		this._updateErrorState(this._degreesInput, validDegrees, helpText);


		// MINUTES
		if (!Validate.validMinutes(minutes)) {
			validMinutes = false;
			helpText = 'Invalid Minutes. Must be between, 0-60.';
		}

		if (validMinutes) {
			this._measurement.set({'minutes_error': null});
		} else {
			this._measurement.set({'minutes_error': helpText});
		}

		this._updateErrorState(this._minutesInput, validMinutes, helpText);


		// SECONDS

		if (!Validate.validSeconds(seconds)) {
			validSeconds = Validate.validSeconds(seconds);
			helpText = 'Invalid Seconds. Must be between, 0-60.';
		}

		if (validSeconds) {
			this._measurement.set({'seconds_error': null});
		} else {
			this._measurement.set({'seconds_error': helpText});
		}

		this._updateErrorState(this._secondsInput, validSeconds, helpText);

		// update angle_error from deg, min, sec errors
		this._measurement.setAngleError();
	};

	MeasurementView.prototype._updateErrorState = function (el, valid, helpText) {
		if (valid){
			// passes validation
			Util.removeClass(el, 'error');
			el.removeAttribute('title');
		} else {
			// does not pass validation
			el.className = 'error';
			el.title = helpText;
		}
	};

	/**
	 * @param time {Integer}
	 *      Timestamp (in milliseconds) since the epoch.
	 *
	 * @return {String}
	 *      A string formatted as "HH:mm:ss" representing the input time.
	 */
	MeasurementView.prototype._timeToString = function (time) {
		var offset = new Date(time),
		    h = offset.getUTCHours(),
		    m = offset.getUTCMinutes(),
		    s = offset.getUTCSeconds();

		return '' + (h<10?'0':'') + h + (m<10?':0':':') + m + (s<10?':0':':') + s;
	};

	/**
	 * @param time {String}
	 *      The formatted time string to parse. The date for the returned time
	 *      is inherited from the observation "begin" attribute.
	 *
	 * @return {Integer}
	 *      The millisecond timestamp since the epoch.
	 */
	MeasurementView.prototype._stringToTime = function (time) {
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
	 * @param degs {Number}
	 *        The degree portion of the angle value. If this is a decimal, then
	 *        the fractional portion is converted to minutes.
	 * @param mins {Number}
	 *        The minutes portion of the angle value. If this is a decimal, then
	 *        the fractional portion is converted to seconds.
	 * @param secs {Integer}
	 *        The seconds portion of the angle value.
	 *
	 * @return {Decimal}
	 *        The decimal degrees for the given DMS value.
	 *
	 * @see MeasurementViewTest#degree_inversion_check
	 */
	MeasurementView.prototype._dmsToDecimal = function (degs, mins, secs) {
		return (parseInt(secs, 10) / 3600) + (parseFloat(mins) / 60) +
				parseFloat(degs);
	};

	/**
	 * @see MeasurementViewTest#degree_inversion_check
	 */
	MeasurementView.prototype._decimalToDms = function (angle) {
		var degrees = parseInt(angle, 10),
		    minutes = (angle - degrees) * 60,
		    seconds = Math.round((minutes - parseInt(minutes, 10)) * 60, 10);

		minutes = parseInt(minutes, 10);

		// Correct any errors due to floating point
		minutes += parseInt(seconds / 60, 10);
		seconds = seconds % 60;

		return [degrees, minutes, seconds];
	};

	return MeasurementView;
});
