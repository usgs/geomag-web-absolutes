/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/Formatter',
	'geomag/Measurement'
], function (
	View,
	Util,

	Format,
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
		    dms = null,
		    hMeasurement = this._measurement.get('h'),
		    eMeasurement = this._measurement.get('e'),
		    zMeasurement = this._measurement.get('z'),
		    fMeasurement = this._measurement.get('f');

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


		if(hMeasurement !== null) {
			this._hValue.innerHTML =
				Format.nanoteslas(hMeasurement);
		}
		else {
			this._hValue.innerHTML = '--';
		}
		if(eMeasurement !== null) {
			this._eValue.innerHTML =
				Format.nanoteslas(eMeasurement);
		}
		else {
			this._eValue.innerHTML = '--';
		}
		if(zMeasurement !== null) {
			this._zValue.innerHTML =
				Format.nanoteslas(zMeasurement);
		}
		else {
			this._zValue.innerHTML = '--';
		}
		if(fMeasurement !== null) {
			this._fValue.innerHTML =
				Format.nanoteslas(fMeasurement);
		}
		else {
			this._fValue.innerHTML = '--';
		}
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
				'time': Format.parseRelativeTime(time),
				'angle': Format.dmsToDecimal(degrees, minutes, seconds)
			});
		};

		this._timeInput.addEventListener('blur', onInputChange);
		this._degreesInput.addEventListener('blur', onInputChange);
		this._minutesInput.addEventListener('blur', onInputChange);
		this._secondsInput.addEventListener('blur', onInputChange);

		this._measurement.on('change', this.render, this);

		this.render();
	};

	return MeasurementView;
});
