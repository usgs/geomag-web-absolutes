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


	var VerticalIntensitySummaryView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	VerticalIntensitySummaryView.prototype = Object.create(View.prototype);


	VerticalIntensitySummaryView.prototype.render = function () {
		var reading = this._reading,
		    startTime = null,
		    endTime = null,
		    times;

		this._name.innerHTML = reading.get('set_number');

		this._valid.checked = (reading.get('vertical_intensity_valid') === 'Y');

		times = this._getMeasurementValues('time');
		if (times.length > 0) {
			startTime = Math.min.apply(null, times);
			endTime = Math.max.apply(null, times);
		}
		this._startTime.innerHTML = Formatter.time(startTime);
		this._endTime.innerHTML = Formatter.time(endTime);

		this._absValue.innerHTML =
				Formatter.nanoteslas(this._calculator.verticalComponent(reading));
		this._ord.innerHTML = Formatter.nanoteslas(this._calculator.meanZ(reading));
		this._baselineValue.innerHTML =
				Formatter.nanoteslas(this._calculator.baselineZ(reading));
		this._observer.innerHTML = this._reading.get('observer') || '';
	};

	VerticalIntensitySummaryView.prototype._initialize = function () {
		var el = this._el,
		    i = null,
		    len = null;

		el.innerHTML = [
			'<th class="name" scope="row"></th>',
			'<td class="valid"><input type="checkbox" /></td>',
			'<td class="start-time"></td>',
			'<td class="end-time"></td>',
			'<td class="abs-value"></td>',
			'<td class="ord"></td>',
			'<td class="baseline-values"></td>',
			'<td class="observer"></td>'
		].join('');

		this._name = el.querySelector('.name');
		this._valid = el.querySelector('.valid > input');
		this._startTime = el.querySelector('.start-time');
		this._endTime = el.querySelector('.end-time');
		this._absValue = el.querySelector('.abs-value');
		this._ord = el.querySelector('.ord');
		this._baselineValue = el.querySelector('.baseline-values');
		this._observer = el.querySelector('.observer');

		this._reading = this._options.reading;
		this._calculator = this._options.calculator;

		this._measurements = this._getVerticalIntensityMeasurements();

		this._onChange = this._onChange.bind(this);
		this._valid.addEventListener('change', this._onChange);

		this._reading.on('change:vertical_intensity_valid', this.render, this);

		this._calculator.on('change', this.render, this);

		for (i = 0, len = this._measurements.length; i < len; i++) {
			this._measurements[i].on('change', this.render, this);
		}
		this.render();
	};

	VerticalIntensitySummaryView.prototype._getVerticalIntensityMeasurements =
			function () {
		var allMeasurements = this._reading.getMeasurements(),
		    measurements = [];

		measurements.push(allMeasurements[Measurement.SOUTH_DOWN][0]);
		measurements.push(allMeasurements[Measurement.NORTH_UP][0]);
		measurements.push(allMeasurements[Measurement.SOUTH_UP][0]);
		measurements.push(allMeasurements[Measurement.NORTH_DOWN][0]);

		return measurements;
	};

	VerticalIntensitySummaryView.prototype._getMeasurementValues =
			function (name) {
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

	VerticalIntensitySummaryView.prototype._onChange = function () {
		this._reading.set({
			vertical_intensity_valid: (this._valid.checked ? 'Y' : 'N')
		});
	};
	return VerticalIntensitySummaryView;
});