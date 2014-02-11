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
		    timeHours = null,
		    timeMinutes = null,
		    timeSeconds = null,
		    angleDegrees = null,
		    angleMinutes = null,
		    angleSeconds = null;

		// Deconstruct time (in milliseconds) from measurement object back to
		// an 'HH:ii:ss' format
		// TODO :: Refactor to its own method for testability
		if (time === null) {
			timeString = '00:00:00';
		} else {
			timeString = this._timeToString(time);
		}

		// Deconstruct the decimal degrees back to Dms
		// TODO :: Refactor to its own method for testability
		if (angle === null) {
			angleDegrees = 0;
			angleMinutes = 0.0;
			angleSeconds = 0.0;
		} else {
			angleDegrees = parseInt(angle, 10);
			angleMinutes = (angle - angleDegrees) * 60;
			angleSeconds = (angleMinutes - parseInt(angleMinutes, 10)) * 60;

			angleMinutes = parseInt(angleMinutes, 10);
		}

		this._timeInput.value = timeString;
		this._degreesInput.value = angleDegrees;
		this._minutesInput.value = angleMinutes;
		this._secondsInput.value = angleSeconds;

		this._hValue.innerHTML = this._measurement.get('h') || '--';
		this._eValue.innerHTML = this._measurement.get('e') || '--';
		this._zValue.innerHTML = this._measurement.get('z') || '--';
		this._fValue.innerHTML = this._measurement.get('f') || '--';
	};

	MeasurementView.prototype._initialize = function () {
		var _this = this,
		    onInputChange = null;

		this._measurement = this._options.measurement;

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
			    degrees = parseInt(_this._degreesInput.value||'0', 10),
			    minutes = parseFloat(_this._minutesInput.value||'0.0'),
			    seconds = parseFloat(_this._secondsInput.value||'0.0');

			// TODO :: Improve this


			time = this._stringToTime(time);

			minutes += (seconds / 60);
			degrees += (minutes / 60);

			_this._measurement.set({'time': time, 'angle': degrees});
		};

		this._timeInput.addEventListener('blur', onInputChange);
		this._degreesInput.addEventListener('blur', onInputChange);
		this._minutesInput.addEventListener('blur', onInputChange);
		this._secondsInput.addEventListener('blur', onInputChange);

		this._measurement.on('change', this._render, this);

		this.render();
	};

	/**
	 * @param time {Integer}
	 *      The time offset (in milliseconds) from the beginning of the day.
	 *
	 * @return {String}
	 *      A string formatted as "HH:mm:ss" representing the input time.
	 */
	MeasurementView.prototype._timeToString = function (time) {
		var offset = time / 1000,
		    timeHours = parseInt(offset / 3600, 10),
		    timeMinutes = parseInt((offset % 3600) / 60, 10),
		    timeSeconds = parseInt((offset % 60), 10);

		if (timeHours < 10) {
			timeHours = '0' + timeHours;
		}
		if (timeMinutes < 10) {
			timeMinutes = '0' + timeMinutes;
		}
		if (timeSeconds < 10) {
			timeSeconds = '0' + timeSeconds;
		}

		return '' + timeHours + ':' + timeMinutes + ':' + timeSeconds;
	};

	/**
	 * @param time {String}
	 *      The formatted time string to parse.
	 *
	 * @return {Integer}
	 *      The offset (in milliseconds) represented by the input time string.
	 */
	MeasurementView.prototype._stringToTime = function (time) {
		var timeString = time.replace(/[^\d]/g, ''),
		    offset = null;

		if (timeString.length === 4) {
			// HHMM
			offset = ((parseInt(timeString.substr(0, 2), 10) * 3600) +
			       (parseInt(timeString.substr(2, 2), 10) * 60)) * 1000;
		} else if (timeString.length === 5) {
			// HMMSS
			offset = ((parseInt(timeString.substr(0, 1), 10) * 3600) +
			       (parseInt(timeString.substr(1, 2), 10) * 60) +
			       parseInt(timeString.substr(3, 2), 10)) * 1000;
		} else if (timeString.length === 6) {
			// HHMMSS
			offset = ((parseInt(timeString.substr(0, 2), 10) * 3600) +
			       (parseInt(timeString.substr(2, 2), 10) * 60) +
			       parseInt(timeString.substr(4, 2), 10)) * 1000;
		}

		return offset;
	};


	return MeasurementView;
});
