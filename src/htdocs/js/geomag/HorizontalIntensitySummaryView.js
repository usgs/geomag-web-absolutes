/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/Formatter',
	'geomag/Measurement',
	'geomag/ObservatoryFactory'
], function (
	View,
	Util,

	Format,
	Measurement,
	ObservatoryFactory
) {
	'use strict';


	var DEFAULTS = {
		factory: new ObservatoryFactory()
	};


	var HorizontalIntensitySummaryView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	HorizontalIntensitySummaryView.prototype = Object.create(View.prototype);


	HorizontalIntensitySummaryView.prototype.render = function () {
		var reading = this._reading,
		    measurements = reading.get('measurements').data(),
		    factory = this._options.factory,
		    startTime = null,
		    endTime = null,
		    times;

		this._name.innerHTML = reading.get('set_number');

		this._valid.checked = (reading.get('horizontal_intensity_valid') === 'Y');

		times = factory.getMeasurementValues(measurements, 'time');
		if (times.length > 0) {
			startTime = Math.min.apply(null, times);
			endTime = Math.max.apply(null, times);
		}
		this._startTime.innerHTML = Format.time(startTime);
		this._endTime.innerHTML = Format.time(endTime);

		this._absValue.innerHTML =
				Format.nanoteslas(this._calculator.horizontalComponent(reading));
		this._ord.innerHTML =
				Format.nanoteslas(this._calculator.meanH(reading));
		this._baselineValues.innerHTML =
				Format.nanoteslas(this._calculator.hBaseline(reading));
		this._observer.innerHTML = this._reading.get('observer') || '';
	};

	HorizontalIntensitySummaryView.prototype._initialize = function () {
		var el = this._el,
		    factory = this._options.factory,
		    reading = this._options.reading,
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
		this._baselineValues = el.querySelector('.baseline-values');
		this._observer = el.querySelector('.observer');

		this._reading = this._options.reading;
		this._calculator = this._options.calculator;

		this._measurements = factory.getHorizontalIntensityMeasurements(reading);

		this._onChange = this._onChange.bind(this);
		this._valid.addEventListener('change', this._onChange);

		this._reading.on('change:horizontal_intensity_valid', this.render, this);

		this._calculator.on('change', this.render, this);

		for (i = 0, len = this._measurements.length; i < len; i ++){
			this._measurements[i].on('change', this.render, this);
		}
		this.render();
	};

	HorizontalIntensitySummaryView.prototype._onChange = function () {
		this._reading.set({
			horizontal_intensity_valid: (this._valid.checked ? 'Y' : 'N')
		});
	};
	return HorizontalIntensitySummaryView;
});
