/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/Measurement'
], function (
	View,
	Util,

	Measurement
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
		var time = this._measurement.get('time'),
		    angle = this._measurement.get('angle'),
		    timeString = null,
		    dms = null;

		if (time === null) {
			timeString = '';
		} else {
			timeString = this._timeToString(time);
		}

		// Deconstruct the decimal degrees back to Dms
		// TODO :: Refactor to its own method for testability
		if (angle === null) {
			dms = ['', '', ''];
		} else {
			dms = this._decimalToDms(angle);
		}

		this._timeInput.value = timeString;
		this._degreesInput.value = dms[0];
		this._minutesInput.value = dms[1];
		this._secondsInput.value = dms[2];

		this._hValue.innerHTML = this._measurement.get('h') || '--';
		this._eValue.innerHTML = this._measurement.get('e') || '--';
		this._zValue.innerHTML = this._measurement.get('z') || '--';
		this._fValue.innerHTML = this._measurement.get('f') || '--';
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
			var time = _this._timeInput.value || '00:00:00',
			    degrees = parseFloat(_this._degreesInput.value||'0.0'),
			    minutes = parseFloat(_this._minutesInput.value||'0.0'),
			    seconds = parseInt(_this._secondsInput.value||'0', 10);

			_this._measurement.set({
				'time': _this._stringToTime(time),
				'angle': _this._dmsToDecimal(degrees, minutes, seconds)
			});
		};

		this._timeInput.addEventListener('blur', onInputChange);
		this._degreesInput.addEventListener('blur', onInputChange);
		this._minutesInput.addEventListener('blur', onInputChange);
		this._secondsInput.addEventListener('blur', onInputChange);

		this._measurement.on('change', this.render, this);

		this.render();
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
