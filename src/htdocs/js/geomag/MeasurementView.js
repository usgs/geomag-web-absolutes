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
		    time_error = measurement.get('time_error'),
		    angle = measurement.get('angle'),
		    angle_error = measurement.get('angle_error'),
		    timeString = null,
		    dms = null,
		    h = measurement.get('h'),
		    e = measurement.get('e'),
		    z = measurement.get('z'),
		    f = measurement.get('f');

		if (time_error === null) {
			if (time === null) {
				timeString = '';
			} else {
				timeString = Format.time(time);
			}
			this._timeInput.value = timeString;
		}

		if (angle_error === null) {
			if (angle === null) {
				dms = ['', '', ''];
			} else {
				dms = Format.decimalToDms(angle);
			}
			this._degreesInput.value = dms[0];
			this._minutesInput.value = dms[1];
			this._secondsInput.value = dms[2];
		}

		this._hValue.innerHTML = (h === null ? '&ndash;' : Format.nanoteslas(h));
		this._eValue.innerHTML = (e === null ? '&ndash;' : Format.nanoteslas(e));
		this._zValue.innerHTML = (z === null ? '&ndash;' : Format.nanoteslas(z));
		this._fValue.innerHTML = (f === null ? '&ndash;' : Format.nanoteslas(f));
	};

	MeasurementView.prototype._initialize = function () {
		var _this = this,
		    onTimeChange = null,
		    onAngleChange = null;

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

			'<td class="measurement-h">&ndash;</td>',
			'<td class="measurement-e">&ndash;</td>',
			'<td class="measurement-z">&ndash;</td>',
			'<td class="measurement-f">&ndash;</td>'
		].join('');

		this._timeInput = this._el.querySelector('.measurement-time > input');
		this._degreesInput = this._el.querySelector('.measurement-degrees > input');
		this._minutesInput = this._el.querySelector('.measurement-minutes > input');
		this._secondsInput = this._el.querySelector('.measurement-seconds > input');

		this._hValue = this._el.querySelector('.measurement-h');
		this._eValue = this._el.querySelector('.measurement-e');
		this._zValue = this._el.querySelector('.measurement-z');
		this._fValue = this._el.querySelector('.measurement-f');

		onTimeChange = function (/*evt*/) {
			var time = _this._timeInput.value,
			    error = null;

			// validate time change
			error = _this._validateTime(time);

			if (error === null) {
				// no errors on measurement, set measurement values
				_this._measurement.set({
					// TODO, add offset
					'time': Format.parseRelativeTime(time,
							_this._observation.get('begin')),
					'time_error': null
				});
			} else {
				_this._measurement.set({'time_error': error});
			}
		};

		onAngleChange = function (/*evt*/) {
			var degrees = _this._degreesInput.value,
			    minutes = _this._minutesInput.value,
			    seconds = _this._secondsInput.value,
			    error = null;

			// validate angle change
			error = _this._validateAngle(degrees, minutes, seconds);

			if (error === null) {
				// no errors on measurement, set measurement values
				_this._measurement.set({
					'angle': Format.dmsToDecimal(degrees, minutes, seconds),
					'angle_error': null
				});
			} else {
				_this._measurement.set({
					'angle_error': 'Invalid Angle. Check Deg, Min, Sec values.'
				});
			}
		};

		this._measurement.on('change', this.render, this);
		this._timeInput.addEventListener('blur', onTimeChange);
		this._degreesInput.addEventListener('blur', onAngleChange);
		this._minutesInput.addEventListener('blur', onAngleChange);
		this._secondsInput.addEventListener('blur', onAngleChange);

		this.render();
	};


	MeasurementView.prototype._validateTime = function (time) {
		var validTime = true,
		    helpText = null;

		if (!Validate.validTime(time)) {
			validTime = false;
			helpText = 'Invalid Time. HH24:MI:SS';
		}
		this._updateErrorState(this._timeInput, validTime, helpText);

		return helpText;
	};

	MeasurementView.prototype._validateAngle =
			function (degrees, minutes, seconds) {
		var validDegrees = true,
		    validMinutes = true,
		    validSeconds = true,
		    helpText = null;

		// DEGREES
		if (!Validate.validDegrees(degrees)) {
			validDegrees = false;
			helpText = 'Invalid Degrees. Must be between, 0-360.';
		}
		this._updateErrorState(this._degreesInput, validDegrees, helpText);

		// MINUTES
		if (!Validate.validMinutes(minutes)) {
			validMinutes = false;
			helpText = 'Invalid Minutes. Must be between, 0-60.';
		}
		this._updateErrorState(this._minutesInput, validMinutes, helpText);

		// SECONDS
		if (!Validate.validSeconds(seconds)) {
			validSeconds = false;
			helpText = 'Invalid Seconds. Must be between, 0-60.';
		}
		this._updateErrorState(this._secondsInput, validSeconds, helpText);

		return helpText;
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

	return MeasurementView;
});
