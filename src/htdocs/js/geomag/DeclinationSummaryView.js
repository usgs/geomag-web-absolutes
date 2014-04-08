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


	var DeclinationSummaryView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	DeclinationSummaryView.prototype = Object.create(View.prototype);


	DeclinationSummaryView.prototype.render = function () {
		var reading = this._reading,
		    startTime = null,
		    endTime = null,
		    times;

		this._name.innerHTML = reading.get('set_number');

		this._valid.checked = (reading.get('declination_valid') === 'Y');

		times = this._getMeasurementValues('time');
		if (times.length > 0) {
			startTime = Math.min.apply(null, times);
			endTime = Math.max.apply(null, times);
		}
		this._startTime.innerHTML = Format.time(startTime);
		this._endTime.innerHTML = Format.time(endTime);

		this._shift.value = reading.get('declination_shift');

		this._absolute.innerHTML = Format.degreesMinutes(
				this._calculator.magneticDeclination(reading));

		this._ordMin.innerHTML =
				Format.minutes(this._calculator.dComputed(reading));
		this._baselineMin.innerHTML =
				Format.minutes(this._calculator.dBaseline(reading));
		this._eBaseline.innerHTML =
				Format.nanoteslas(this._calculator.eBaseline(reading));
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
			'<td class="absolute-declination"></td>',
			'<td class="ord-min"></td>',
			'<td class="baseline-min"></td>',
			'<td class="baseline-nt"></td>',
			'<td class="observer"></td>',
			'<td class="shift">',
				'<select>',
					'<option value="-180">-180</option>',
					'<option value="0" selected="selected">0</option>',
					'<option value="180">+180</option>',
				'</select>',
			'</td>'

		].join('');

		this._name = el.querySelector('.name');
		this._valid = el.querySelector('.valid > input');
		this._startTime = el.querySelector('.start-time');
		this._endTime = el.querySelector('.end-time');
		this._absolute = el.querySelector('.absolute-declination');
		this._ordMin = el.querySelector('.ord-min');
		this._baselineMin = el.querySelector('.baseline-min');
		this._eBaseline = el.querySelector('.baseline-nt');
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

	DeclinationSummaryView.prototype._onChange = function () {
		this._reading.set({
			declination_valid: (this._valid.checked ? 'Y' : 'N'),
			declination_shift: parseInt(this._shift.value, 10)
		});
	};
	return DeclinationSummaryView;
});
