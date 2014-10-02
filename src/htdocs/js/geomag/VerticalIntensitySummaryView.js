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


	var VerticalIntensitySummaryView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	VerticalIntensitySummaryView.prototype = Object.create(View.prototype);


	VerticalIntensitySummaryView.prototype.render = function () {
		var reading = this._reading,
		    measurements = reading.get('measurements').data(),
		    factory = this._options.factory,
		    startTime = null,
		    endTime = null,
		    times;

		this._name.innerHTML = reading.get('set_number');

		this._valid.checked = (reading.get('vertical_intensity_valid') === 'Y');

		times = factory.getMeasurementValues(measurements, 'time');
		if (times.length > 0) {
			startTime = Math.min.apply(null, times);
			endTime = Math.max.apply(null, times);
		}
		this._startTime.innerHTML = Format.time(startTime);
		this._endTime.innerHTML = Format.time(endTime);

		this._absValue.innerHTML =
				Format.nanoteslas(this._calculator.verticalComponent(reading));
		this._ord.innerHTML = Format.nanoteslas(this._calculator.meanZ(reading));
		this._baselineValue.innerHTML =
				Format.nanoteslas(this._calculator.zBaseline(reading));
	};

	VerticalIntensitySummaryView.prototype._initialize = function () {
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
			'<td class="baseline-values"></td>'
		].join('');

		this._name = el.querySelector('.name');
		this._valid = el.querySelector('.valid > input');
		this._startTime = el.querySelector('.start-time');
		this._endTime = el.querySelector('.end-time');
		this._absValue = el.querySelector('.abs-value');
		this._ord = el.querySelector('.ord');
		this._baselineValue = el.querySelector('.baseline-values');

		this._reading = this._options.reading;
		this._calculator = this._options.calculator;

		this._measurements = factory.getVerticalIntensityMeasurements(reading);

		this._onChange = this._onChange.bind(this);
		this._valid.addEventListener('change', this._onChange);

		this._reading.on('change:vertical_intensity_valid', this.render, this);

		this._calculator.on('change', this.render, this);

		for (i = 0, len = this._measurements.length; i < len; i++) {
			this._measurements[i].on('change', this.render, this);
		}
		this.render();
	};

	VerticalIntensitySummaryView.prototype._onChange = function () {
		this._reading.set({
			vertical_intensity_valid: (this._valid.checked ? 'Y' : 'N')
		});
	};

	return VerticalIntensitySummaryView;
});
