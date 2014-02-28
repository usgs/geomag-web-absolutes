/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/DeclinationSummaryView',
	'geomag/HorizontalIntensitySummaryView',
	'geomag/VerticalIntensitySummaryView',
	'geomag/Formatter'
], function (
	View,
	Util,

	DeclinationSummaryView,
	HorizontalIntensitySummaryView,
	VerticalIntensitySummaryView,
	Formatter
) {
	'use strict';


	var DEFAULTS = {
	};


	var ObservationSummaryView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ObservationSummaryView.prototype = Object.create(View.prototype);

	ObservationSummaryView.prototype.render = function () {
		this._renderDeclination();
		this._renderInclination();
		this._renderSummaryBottom();
	};

	ObservationSummaryView.prototype._renderDeclination = function () {
		var readings = this._readings.data(),
		    declinationSummaryView = this._declinationSummaryView,
		    calculator = this._calculator,
		    i = null,
		    len = null,
		    reading,
		    range,
		    baselineD = [],
		    baselineDNt = [],
		    baselineDStats,
		    baselineDNtStats;

		Util.empty(declinationSummaryView);

		for (i = 0, len = readings.length; i < len; i++) {
			reading = readings[i];
			// create view if it does not exist
			if (!reading.hasOwnProperty('_declinationSummary')) {
				reading._declinationSummary = new DeclinationSummaryView({
					el:document.createElement('tr'),
					reading:reading,
					calculator:calculator
				});
			}
			// insert view
			declinationSummaryView.appendChild(reading._declinationSummary._el);

			// insert view
			if (reading.get('declination_valid') === 'Y') {
				baselineD.push(calculator.baselineD(reading));
				baselineDNt.push(calculator.d(reading));
			}
		}

		baselineDStats = calculator.getStats(baselineD);
		baselineDNtStats = calculator.getStats(baselineDNt);

		this._baselineMinMean.innerHTML = Formatter.minutes(baselineDStats.mean);
		this._baselineNtMean.innerHTML =
				Formatter.nanoteslas(baselineDNtStats.mean);

		range = baselineDStats.max - baselineDStats.min;
		this._baselineMinRange.innerHTML = Formatter.minutes(range);

		range = baselineDNtStats.max - baselineDNtStats.min;
		this._baselineNtRange.innerHTML = Formatter.nanoteslas(range);

		this._baselineMinStdDev.innerHTML =
				Formatter.minutes(baselineDStats.stdDev);
		this._baselineNtStdDev.innerHTML =
				Formatter.nanoteslas(baselineDNtStats.stdDev);
	};

	ObservationSummaryView.prototype._renderInclination = function () {
		this._renderHorizontalIntensitySummaryView();
		this._renderVerticalIntensitySummaryView();
	};

	ObservationSummaryView.prototype._renderHorizontalIntensitySummaryView =
			function () {
		var readings = this._readings.data(),
		    horizontalIntensitySummaryView = this._horizontalIntensitySummaryView,
		    calculator = this._calculator,
		    i = null,
		    len = null,
		    reading,
		    range,
		    baselineH = [],
		    baselineHStats;

		Util.empty(horizontalIntensitySummaryView);

		for (i = 0, len = readings.length; i < len; i++) {
			reading = readings[i];

			if (!reading.hasOwnProperty('_horizontalIntensitySummary')) {
				reading._horizontalIntensitySummary =
						new HorizontalIntensitySummaryView({
					el:document.createElement('tr'),
					reading:reading,
					calculator:calculator
				});
			}
			// insert view
			horizontalIntensitySummaryView.appendChild(
				reading._horizontalIntensitySummary._el);

			if (reading.get('horizontal_intensity_valid') === 'Y') {
				baselineH.push(calculator.baselineH(reading));
			}
		}
		baselineHStats = calculator.getStats(baselineH);
		this._baselineValuesMean.innerHTML =
				Formatter.nanoteslas(baselineHStats.mean);

		range = baselineHStats.max - baselineHStats.min;
		this._baselineValuesRange.innerHTML = Formatter.nanoteslas(range);

		this._baselineValuesStdDev.innerHTML =
				Formatter.nanoteslas(baselineHStats.stdDev);
	};

	ObservationSummaryView.prototype._renderVerticalIntensitySummaryView =
			function () {
		var readings = this._readings.data(),
		    verticalIntensitySummaryView = this._verticalIntensitySummaryView,
		    calculator = this._calculator,
		    i = null,
		    len = null,
		    reading,
		    range,
		    baselineZ = [],
		    baselineZStats;

		Util.empty(verticalIntensitySummaryView);
		for (i = 0, len = readings.length; i < len; i++) {
			reading = readings[i];

			// Create view if it does not exits
			if (!reading.hasOwnProperty('_verticalIntensitySummary')) {
				reading._verticalIntensitySummary = new VerticalIntensitySummaryView({
					el:document.createElement('tr'),
					reading:reading,
					calculator:calculator
				});
			}
			// insert view
			verticalIntensitySummaryView.appendChild
					(reading._verticalIntensitySummary._el);

			if (reading.get('vertical_intensity_valid') === 'Y') {
				baselineZ.push(calculator.baselineZ(reading));
			}
		}
		baselineZStats = calculator.getStats(baselineZ);

		this._verticalBaselineValuesMean.innerHTML =
				Formatter.nanoteslas(baselineZStats.mean);

		range = baselineZStats.max - baselineZStats.min;
		this._verticalBaselineValuesRange.innerHTML = Formatter.nanoteslas(range);

		this._verticalBaselineValuesStdDev.innerHTML =
				Formatter.nanoteslas(baselineZStats.stdDev);
	};

	ObservationSummaryView.prototype._renderSummaryBottom = function () {
		var observation = this._observation;

		this._pierTemperature.innerHTML =
				Formatter.celsius(observation.get('pier_temperature'),1);
		this._electronicsTemperature.innerHTML = 'elec temp';
		this._fluxgateTemperature.innerHTML = 'flux temp';
		this._protonTemperature.innerHTML = 'prot temp';
		this._outsideTemperature.innerHTML = 'outs temp';
		this._checkedBy.innerHTML = 'user name';
		this._remarks.innerHTML = observation.get('annotation');
	};

	ObservationSummaryView.prototype._initialize = function () {
		var el = this._el;

		this._observation = this._options.observation;
		this._calculator = this._options.baselineCalculator;
		this._readings = this._observation.get('readings');

		el.innerHTML = [
			'<section class="observation-summary-view">',
				'<h4>Declination</h4>',
				'<table>',
					'<thead>',
						'<tr>',
							'<th scope="col" class="name">Set</th>',
							'<th scope="col" class="valid">Valid</th>',
							'<th scope="col" class="start-time">Start Time</th>',
							'<th scope="col" class="end-time">End Time</th>',
							'<th scope="col" colspan="2" class="absolute-declination">',
									'Absolute Declination</th>',
							'<th scope="col" class="ord-min">Ordinate</th>',
							'<th scope="col" colspan="2" class="baseline-values">',
									'Baseline Values</th>',
							'<th scope="col" class="observer">Observer</th>',
							'<th scope="col" class="shift">180&#176; Shift</th>',
						'</tr>',
					'</thead>',
					'<tbody class="declination-summary-view">',
					'</tbody>',
				'</table>',
				'<table>',
					'<thead>',
						'<th scope="col"></th>',
						'<th scope="col" class="baseline-min">Min.</th>',
						'<th scope="col" class="baseline-nt">nT</th>',
					'</thead>',
					'<tbody>',
						'<tr>',
							'<th class="mean">Mean:</th>',
							'<td class="baseline-min-mean"></td>',
							'<td class="baseline-nt-mean"></td>',
						'</tr>',
						'<tr>',
							'<th scope="row" class="declination-range">Range:</th>',
							'<td class="baseline-min-range"></td>',
							'<td class="baseline-nt-range"></td>',
						'</tr>',
						'<tr>',
							'<th scope="row" class="baseline-std-dev">Std. Deviation:</th>',
							'<td class="baseline-min-std-dev"></td>',
							'<td class="baseline-nt-std-dev"></td>',
						'</tr>',
					'</tbody>',
				'</table>',
				'<h4>Horizontal Intensity</h4>',
				'<table>',
					'<thead>',
						'<tr>',
							'<th scope="col" class="name">Set</th>',
							'<th scope="col" class="valid">Valid</th>',
							'<th scope="col" class="start-time">Start Time</th>',
							'<th scope="col" class="end-time">End Time</th>',
							'<th scope="col" class="abs-value">Abs. Value (nT)</th>',
							'<th scope="col" class="ord">Ordinate</th>',
							'<th scope="col" class="baseline-values">',
									'Baseline Values (nT)</th>',
							'<th scope="col" class="observer">Observer</th>',
						'</tr>',
					'</thead>',
					'<tbody class="horizontal-intensity-summary-view">',
					'</tbody>',
				'</table>',
				'<table>',
					'<thead>',
						'<th scope="col"></th>',
						'<th scope="col" class="baseline-values">',
								'Baseline Values (nT)</th>',
					'</thead>',
					'<tbody>',
						'<tr>',
							'<th class="mean">Mean:</th>',
							'<td class="baseline-values-mean"></td>',
						'</tr>',
						'<tr>',
							'<th scope="row" class="range">Range:</th>',
							'<td class="baseline-values-range"></td>',
						'</tr>',
						'<tr>',
							'<th scope="row" class="Std-dev">Std. Deviation:</th>',
							'<td class="baseline-values-std-dev"></td>',
						'</tr>',
					'</tbody>',
				'</table>',
				'<h4>Vertical Intensity</h4>',
				'<table>',
					'<thead>',
						'<tr>',
							'<th scope="col" class="name">Set</th>',
							'<th scope="col" class="valid">Valid</th>',
							'<th scope="col" class="start-time">Start Time</th>',
							'<th scope="col" class="end-time">End Time</th>',
							'<th scope="col" class="abs-value">Abs. Value (nT)</th>',
							'<th scope="col" class="ord">Ordinate</th>',
							'<th scope="col" class="baseline-values">',
									'Baseline Values (nT)</th>',
							'<th scope="col" class="observer">Observer</th>',
						'</tr>',
					'</thead>',
					'<tbody class="vertical-intensity-summary-view">',
					'</tbody>',
				'</table>',
				'<table>',
					'<thead>',
						'<th scope="col"></th>',
						'<th scope="col" class="baseline-values">',
								'Baseline Values (nT)</th>',
					'</thead>',
					'<tbody>',
						'<tr>',
							'<th scope="row" class="mean">Mean:</th>',
							'<td class="vertical-baseline-values-mean"></td>',
						'</tr>',
						'<tr>',
							'<th scope="row" class="range">Range:</th>',
							'<td class="vertical-baseline-values-range"></td>',
						'</tr>',
						'<tr>',
							'<th scope="row" class="std-dev">Std. Deviation:</th>',
							'<td class="vertical-baseline-values-std-dev"></td>',
						'</tr>',
					'</tbody>',
				'</table>',
				'<h4>Temperatures</h4>',
				'<table class="temperature-view">',
					'<thead>',
						'<tr>',
							'<th scope="col">Pier</th>',
							'<th scope="col">Electronics</th>',
							'<th scope="col">Fluxgate</th>',
							'<th scope="col">Proton</th>',
							'<th scope="col">Outside</th>',
						'</tr>',
					'</thead>',
					'<tbody>',
						'<tr>',
							'<td class="pier-temp-value"></td>',
							'<td class="electronics-temp-value"></td>',
							'<td class="fluxgate-temp-value"></td>',
							'<td class="proton-temp-value"></td>',
							'<td class="outside-temp-value"></td>',
						'</tr>',
					'</tbody>',
				'</table>',
				'<section class="reviewer">',
					'<h4>Reviewer</h4>',
					'<div>Reviewed by <span class="checked-by-value"></span></div>',
					'<label for="observation-remarks">Reviewer comments</label>',
					'<textarea id="observation-remarks"></textarea>',
				'</section>',
			'</section>'
		].join('');

		this._querySelectors();
		this._bindings();
		this.render();
	};

	ObservationSummaryView.prototype._querySelectors = function () {
		var el = this._el;

		// Declination summary view
		this._declinationSummaryView =
			el.querySelector('.declination-summary-view');
		this._baselineMinMean = el.querySelector('.baseline-min-mean');
		this._baselineNtMean = el.querySelector('.baseline-nt-mean');
		this._baselineMinRange = el.querySelector('.baseline-min-range');
		this._baselineNtRange = el.querySelector('.baseline-nt-range');
		this._baselineMinStdDev = el.querySelector('.baseline-min-std-dev');
		this._baselineNtStdDev = el.querySelector('.baseline-nt-std-dev');

		// Horizontal Intensity Summary view
		this._horizontalIntensitySummaryView =
			el.querySelector('.horizontal-intensity-summary-view');
		this._baselineValuesMean = el.querySelector('.baseline-values-mean');
		this._baselineValuesRange = el.querySelector('.baseline-values-range');
		this._baselineValuesStdDev = el.querySelector('.baseline-values-std-dev');

		// Vertical Intensity Summary View
		this._verticalIntensitySummaryView =
			el.querySelector('.vertical-intensity-summary-view');
		this._verticalBaselineValuesMean =
			el.querySelector('.vertical-baseline-values-mean');
		this._verticalBaselineValuesRange =
			el.querySelector('.vertical-baseline-values-range');
		this._verticalBaselineValuesStdDev =
			el.querySelector('.vertical-baseline-values-std-dev');

		// Bottom Summary View
		this._observation.on('change', this.render, this);
		this._pierTemperature = el.querySelector('.pier-temp-value');
		this._electronicsTemperature = el.querySelector('.electronics-temp-value');
		this._fluxgateTemperature = el.querySelector('.fluxgate-temp-value');
		this._protonTemperature = el.querySelector('.proton-temp-value');
		this._outsideTemperature = el.querySelector('.outside-temp-value');
		this._checkedBy = el.querySelector('.checked-by-value');
		this._remarks = el.querySelector('.reviewer > textarea');
	};

	ObservationSummaryView.prototype._bindings = function () {
		var _this = this;

		this._onChange = this._onChange.bind(this);
		this._remarks.addEventListener('change', this._onChange);
		this._calculator.on('change', this.render, this);

		this._observation.eachReading(function (reading) {
			reading.on('change', _this.render, _this);
			reading.eachMeasurement(function (measurement) {
				measurement.on('change', _this.render, _this);
			});
		});
	};

	ObservationSummaryView.prototype._onChange = function () {
		this._observation.set({
			annotation: this._remarks.value
		});
	};

	return ObservationSummaryView;
});
