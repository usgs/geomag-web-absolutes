/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/Measurement',
	'geomag/Formatter'
], function (
	View,
	Util,

	Measurement,
	Formatter
) {
	'use strict';


	var DEFAULTS = {
	};


	var DeclinationSummaryView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	DeclinationSummaryView.prototype = Object.create(View.prototype);


	DeclinationSummaryView.prototype.render = function () {
		var reading = this._reading,
		    startTime = null,
		    endTime = null,
		    times,
		    degree,
		    dms;

		this._name.innerHTML = reading.get('set_number');

		this._valid.checked = (reading.get('declination_valid') === 'Y');

		times = this._getMeasurementValues('time');
		if (times.length > 0) {
			startTime = Math.min.apply(null, times);
			endTime = Math.max.apply(null, times);
		}
		this._startTime.innerHTML = this._formatTime(startTime);
		this._endTime.innerHTML = this._formatTime(endTime);

		this._shift.value = reading.get('declination_shift');

		degree = this._calculator.magneticDeclination(reading);
		dms = Formatter.decimalToDms(degree);
		this._degrees.innerHTML = Formatter.degrees(dms[0], 0);
		this._minutes.innerHTML = Formatter.minutes(dms[1]);

		this._ordMin.innerHTML =
				Formatter.minutes(this._calculator.computedE(reading));
		this._baselineMin.innerHTML =
				Formatter.minutes(this._calculator.baselineD(reading));
		this._baselineNt.innerHTML =
				Formatter.nanoteslas(this._calculator.d(reading));
		this._observer.innerHTML = this._reading.get('observer') || '';
	};

	DeclinationSummaryView.prototype._initialize = function () {
		var el = this._el,
				i = null,
				len = null;

		el.innerHTML = [
			'<th class="name" scope="row"></th>',
			'<td class="valid"><input type="checkbox" /></td>',
			'<td class="start-time"></td>',
			'<td class="end-time"></td>',
			'<td class="degrees"></td>',
			'<td class="minutes"></td>',
			'<td class="ord-min"></td>',
			'<td class="baseline-min"></td>',
			'<td class="baseline-nt"></td>',
			'<td class="observer"></td>',
			'<td class="shift">',
				'<select>',
					'<option value="-180">-180</option>',
					'<option value="0" selected="selected">0</option>',
					'<option value="+180">+180</option>',
				'</select>',
			'</td>'

		].join('');

		this._name = el.querySelector('.name');
		this._valid = el.querySelector('.valid > input');
		this._startTime = el.querySelector('.start-time');
		this._endTime = el.querySelector('.end-time');
		this._degrees = el.querySelector('.degrees');
		this._minutes = el.querySelector('.minutes');
		this._ordMin = el.querySelector('.ord-min');
		this._baselineMin = el.querySelector('.baseline-min');
		this._baselineNt = el.querySelector('.baseline-nt');
		this._observer = el.querySelector('.observer');
		this._shift = el.querySelector('.shift > select');

		this._reading = this._options.reading;
		this._calculator = this._options.calculator;

		this._measurements = this._getDeclinationMeasurements();

		this._onChange = this._onChange.bind(this);
		this._valid.addEventListener('change', this._onChange);
		this._shift.addEventListener('change', this._onChange);

		this._reading.on('change:declination_valid', this.render, this);
		this._reading.on('change:declination_shift', this.render, this);

		this._calculator.on('change', this.render, this);

		for (i = 0, len = this._measurements.length; i < len; i++) {
			this._measurements[i].on('change', this.render, this);
		}
		this.render();
	};

	DeclinationSummaryView.prototype._getDeclinationMeasurements = function () {
		var allMeasurements = this._reading.getMeasurements(),
		    measurements = [];

		measurements.push(allMeasurements[Measurement.WEST_DOWN][0]);
		measurements.push(allMeasurements[Measurement.EAST_DOWN][0]);
		measurements.push(allMeasurements[Measurement.WEST_UP][0]);
		measurements.push(allMeasurements[Measurement.EAST_UP][0]);

		measurements.push(allMeasurements[Measurement.FIRST_MARK_UP][0]);
		measurements.push(allMeasurements[Measurement.FIRST_MARK_DOWN][0]);
		measurements.push(allMeasurements[Measurement.SECOND_MARK_UP][0]);
		measurements.push(allMeasurements[Measurement.SECOND_MARK_DOWN][0]);

		return measurements;
	};

	DeclinationSummaryView.prototype._getMeasurementValues = function (name) {
		var measurements = this._measurements,
		    i = null,
		    len = null,
		    values = [],
		    value;

		for (i = 0, len = measurements.length; i < len; i++) {
			value = measurements[i].get(name);
			if (value !== null) {
				values.push(measurements[i].get(name));
			}
		}
		return values;
	};

	DeclinationSummaryView.prototype._formatTime = function (time) {
		var h,
		    m,
		    s;
		if (time === null) {
			return '';
		}

		time = new Date(time);
		h = time.getUTCHours();
		m = time.getUTCMinutes();
		s = time.getUTCSeconds();
		return (h < 10?'0':'') + h + ':' +
					 (m < 10?'0':'') + m + ':' +
					 (s < 10?'0':'') + s;
	};

	DeclinationSummaryView.prototype._onChange = function () {
		this._reading.set({
			declination_valid: (this._valid.checked ? 'Y' : 'N'),
			declination_shift: parseInt(this._shift.value, 10)
		});
	};
/*
	DeclinationSummaryView.prototype._decimalToDms = function (angle) {
		var degrees = parseInt(angle, 10),
		    minutes = (angle - degrees) * 60;

		minutes = parseInt(minutes, 10);

		return [degrees, minutes];
	};
*/
	return DeclinationSummaryView;
});
