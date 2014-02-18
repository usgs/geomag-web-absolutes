/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/DeclinationSummaryView',
	'geomag/HorizontalIntensitySummaryView',
	'geomag/VerticalIntensitySummaryView'
], function (
	View,
	Util,

	DeclinationSummaryView,
	HorizontalIntensitySummaryView,
	VerticalIntensitySummaryView
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
		var readings = this._readings.data(),
				declinationSummaryView = this._declinationSummaryView,
				horizontalIntensitySummaryView = this._horizontalIntensitySummaryView,
				verticalIntensitySummaryView = this._verticalIntensitySummaryView,
				calculator = this._calculator,
				i = null,
				len = null,
				reading;
		Util.empty(declinationSummaryView);
		Util.empty(horizontalIntensitySummaryView);
		Util.empty(verticalIntensitySummaryView);
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
			// Create view if it does not exits
			if (!reading.hasOwnProperty('_horizontalIntensitySummary')) {
				reading._horizontalIntensitySummary = new HorizontalIntensitySummaryView({
						el:document.createElement('tr'),
						reading:reading,
						calculator:calculator
				});
			}
			// Create view if it does not exits
			if (!reading.hasOwnProperty('_verticalIntensitySummary')) {
				reading._verticalIntensitySummary = new VerticalIntensitySummaryView({
					el:document.createElement('tr'),
					reading:reading,
					calculator:calculator
				});
			}

			if (!reading.hasOwnProperty('_')) {
			// insert view
			declinationSummaryView.appendChild(reading._declinationSummary._el);
			// insert view
			horizontalIntensitySummaryView.appendChild(reading._horizontalIntensitySummary._el);
			// insert view
			verticalIntensitySummaryView.appendChild(reading._verticalIntensitySummary._el);
			}
		}
	};

	ObservationSummaryView.prototype._initialize = function () {
		var el = this._el;

		this._observation = this._options.observation;
		this._calculator = this._options.calculator;


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
								'<th scope="col" class="degrees">Deg.</th>',
								'<th scope="col" class="minutes">Min.</th>',
								'<th scope="col" class="ord-min">Ord. Min.</th>',
								'<th scope="col" class="baseline-min">Min.</th>',
								'<th scope="col" class="baseline-nt">nT</th>',
								'<th scope="col" class="observer">Observer</th>',
								'<th scope="col" class="shift">180&#176; Shift</th>',
							'</tr>',
						'</thead>',
						'<tbody class="declination-summary-view">',
						'</tbody>',
					'</table>',
					'<table>',
						'<tbody>',
							'<tr>',
								'<td class="declination-mean">Mean:</td>',
								'<td class="declination-mean-outPut"></td>',
							'</tr>',
							'<tr>',
								'<td class="declination-range">Range:</td>',
								'<td class="declination-range-outPut"></td>',
							'</tr>',
							'<tr>',
								'<td class="declination-stdDeviation">Std. Deviation:</td>',
								'<td class="declination-stdDeviation"></td>',
							'</tr>',
						'</tbody>',
					'</table>',
					'<h4>Horizontal Intensity</h4>',
						'<table>',
							'<thead>',
								'<tr>',
									'<th scope="col" class="name">set</th>',
									'<th scope="col" class="valid">Valid</th>',
									'<th scope="col" class="start-time">Start Time</th>',
									'<th scope="col" class="end-time">End Time</th>',
									'<th scope="col" class="abs-value">Abs. Value (nT)</th>',
									'<th scope="col" class="ord">Ord.(nT)</th>',
									'<th scope="col" class="baseline-values">Baseline Values (nT)</th>',
									'<th scope="col" class="observer">Observer</th>',
								'</tr>',
							'</thead>',
							'<tbody class="horizontal-intensity-summary-view">',
							'</tbody>',
						'</table>',
						'<table>',
							'<tbody>',
								'<tr>',
									'<td class="horizontal-intensity-mean">Mean:</td>',
									'<td class="horizontal-intensity-mean-outPut"></td>',
								'</tr>',
								'<tr>',
									'<td class="horizontal-intensity-range">Range:</td>',
									'<td class="horizontal-intensity-range-outPut"></td>',
								'</tr>',
								'<tr>',
									'<td class="horizontal-intensity-stdDeviation">Std. Deviation:</td>',
									'<td class="horizontal-intensity-stdDeviation"></td>',
								'</tr>',
							'</tbody>',
						'</table>',

					'<h4>Vertical Intensity</h4>',
						'<table>',
							'<thead>',
								'<tr>',
									'<th scope="col" class="name">set</th>',
									'<th scope="col" class="valid">Valid</th>',
									'<th scope="col" class="start-time">Start Time</th>',
									'<th scope="col" class="end-time">End Time</th>',
									'<th scope="col" class="abs-value">Abs. Value (nT)</th>',
									'<th scope="col" class="ord">Ord.(nT)</th>',
									'<th scope="col" class="baseline-values">Baseline Values (nT)</th>',
									'<th scope="col" class="observer">Observer</th>',
								'</tr>',
							'</thead>',
							'<tbody class="vertical-intensity-summary-view">',
							'</tbody>',
						'</table>',
						'<table>',
							'<tbody>',
								'<tr>',
									'<td class="vertical-intensity-mean">Mean:</td>',
									'<td class="vertical-intensity-mean-outPut"></td>',
								'</tr>',
								'<tr>',
									'<td class="vertical-intensity-range">Range:</td>',
									'<td class="vertical-intensity-range-outPut"></td>',
								'</tr>',
								'<tr>',
									'<td class="vertical-intensity-stdDeviation">Std. Deviation:</td>',
									'<td class="vertical-intensity-stdDeviation"></td>',
								'</tr>',
							'</tbody>',
						'</table>',

				'<section class="row"',
					'<h4>Temperatures</h4>',
					'<section class="colum one-of-two temperatures">',
						'<table>',
							'<thead>',
								'<tr>',
									'<th scope="col" class="temp-pier">Pier</th>',
									'<th scope="col" class="temp-electronics">Electronics</th>',
									'<th scope="col" class="temp-fluxgate">Fluxgate</th>',
									'<th scope="col" class="temp-proton">Proton</th>',
									'<th scope="col" class="temp-outside>Outside</th>',
									'<th scope="col" class="temp-checkedBy">Checked By:</th>',
								'</tr>',
							'</thead>',
							'<tbody>',
								'<tr>',
									'<th class="pier"></th>',
									'<th class="electronics"></th>',
									'<th class="fluxgate"></th>',
									'<th class="proton"></th>',
									'<th class="outside"></th>',
									'<th class="checkedBy"></th>',
								'</tr>',
								'<tr>',
									'<td class="pier-out"></td>',
									'<td class="electronics-out"></td>',
									'<td class="fluxgate-out"></td>',
									'<td class="proton-out"></td>',
									'<td class="outside-out"></td>',
									'<td class="checkedBy-input"></td>',
								'</tr>',
							'</tbody>',
						'</table>',
					'</section>',
			'</section>'
		].join('');

		this._declinationSummaryView = el.querySelector('.declination-summary-view');

		this._horizontalIntensitySummaryView = el.querySelector('.horizontal-intensity-summary-view');

		this._verticalIntensitySummaryView = el.querySelector('.vertical-intensity-summary-view');

		this.render();
	};


	return ObservationSummaryView;
});
