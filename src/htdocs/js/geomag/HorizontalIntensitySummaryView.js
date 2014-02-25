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


	var HorizontalIntensitySummaryView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	HorizontalIntensitySummaryView.prototype = Object.create(View.prototype);


	HorizontalIntensitySummaryView.prototype.render = function () {
		var reading = this._reading,
		    startTime = null,
		    endTime = null,
		    times;

		this._name.innerHTML = reading.get('set_number');

		this._valid.checked = (reading.get('horizontal_intensity_valid') === 'Y');

		times = this._getMeasurementValues('time');
		if (times.length > 0) {
			startTime = Math.min.apply(null, times);
			endTime = Math.max.apply(null, times);
		}
		this._startTime.innerHTML = this._formatTime(startTime);
		this._endTime.innerHTML = this._formatTime(endTime);

		this._absValue.innerHTML = this._calculator.horizontalComponent(reading);

		this._ord.innerHTML = this._calculator.meanH(reading);

		this._baselineValues.innerHTML = this._calculator.baselineH(reading);
	};

	HorizontalIntensitySummaryView.prototype._initialize = function () {
		var el = this._el,
		    i = null,
			  len = null;
		el.innerHTML = [
			'<th class="name" scope="row">&nbsp;</th>',
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
		this._baselineValues = el.querySelector('.baseline-values');
		this._observer = el.querySelector('.observer');

		this._reading = this._options.reading;
		this._calculator = this._options.calculator;

		this._measurements = this._getHorizontalIntensityMeasurements();

		this._onChange = this._onChange.bind(this);
		this._valid.addEventListener('change', this._onChange);

		this._reading.on('change:horizontal_intensity_valid', this.render, this);

		this._calculator.on('change', this.render, this);

		for (i = 0, len = this._measurements.length; i < len; i ++){
			this._measurements[i].on('change', this.render, this);
		}
		this.render();
	};

	HorizontalIntensitySummaryView.prototype._getHorizontalIntensityMeasurements = function () {
			var allMeasurements = this._reading.getMeasurements(),
			    measurements = [];

			measurements.push(allMeasurements[Measurement.SOUTH_DOWN][0]);
			measurements.push(allMeasurements[Measurement.NORTH_UP][0]);
			measurements.push(allMeasurements[Measurement.SOUTH_UP][0]);
			measurements.push(allMeasurements[Measurement.NORTH_DOWN][0]);

			return measurements;
	};

	HorizontalIntensitySummaryView.prototype._getMeasurementValues = function (name) {
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
HorizontalIntensitySummaryView.prototype._formatTime = function (time) {
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

HorizontalIntensitySummaryView.prototype._onChange = function () {
	this._reading.set({
		horizontal_intensity_valid: (this._valid.checked ? 'Y' : 'N')
	});
};
	return HorizontalIntensitySummaryView;
});