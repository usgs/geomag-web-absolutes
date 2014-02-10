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
			time /= 1000;
			timeHours = parseInt(time / 3600, 10);
			timeMinutes = parseInt((time % 3600) / 60, 10);
			timeSeconds = parseInt((time % 60), 10);

			if (timeHours < 10) {
				timeHours = '0' + timeHours;
			}
			if (timeMinutes < 10) {
				timeMinutes = '0' + timeMinutes;
			}
			if (timeSeconds < 10) {
				timeSeconds = '0' + timeSeconds;
			}

			timeString = '' + timeHours + ':' + timeMinutes + ':' + timeSeconds;
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

		this._measurement = this._options.measurement || new Measurement();

		this._el.innerHTML = [
			'<td class="measurement-time"><input type="text"/></td>',
			'<td class="measurement-degrees"><input type="text"/></td>',
			'<td class="measurement-minutes"><input type="text"/></td>',
			'<td class="measurement-seconds"><input type="text"/></td>',

			'<td class="measurement-h">--</td>',
			'<td class="measurement-e">--</td>',
			'<td class="measurement-z">--</td>',
			'<td class="measurement-f">--</td>',
		].join('');

		this._timeInput = this._el.querySelector('.measurement-time');
		this._degreesInput = this._el.querySelector('.measurement-degrees');
		this._minutesInput = this._el.querySelector('.measurement-minutes');
		this._secondsInput = this._el.querySelector('.measurement-seconds');

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

			time = time.replace(/[^\d]/g, '');

			if (time.length === 4) {
				// HHMM
				time = ((parseInt(time.substr(0, 2), 10) * 3600) +
				       (parseInt(time.substr(2, 2), 10) * 60)) * 1000;
			} else if (time.length === 5) {
				// HMMSS
				time = ((parseInt(time.substr(0, 1), 10) * 3600) +
				       (parseInt(time.substr(1, 2), 10) * 60) +
				       parseInt(time.substr(3, 2), 10)) * 1000;
			} else if (time.length === 6) {
				// HHMMSS
				time = ((parseInt(time.substring(0, 2), 10) * 3600) +
				       (parseInt(time.substring(2, 2), 10) * 60) +
				       parseInt(time.substring(4, 2), 10)) * 1000;
			}

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


	return MeasurementView;
});
