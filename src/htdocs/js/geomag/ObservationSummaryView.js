/* global define */
define([
	'mvc/View',
	'util/Util'
], function (
	View,
	Util
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
		// TODO :: Render current model
	};

	ObservationSummaryView.prototype._initialize = function () {
		this._observation = this._options.observation;
		this._calculator = this._options.calculator;





		this._el.innerHTML = [
			'<section class="observation-summary-view">',
				'<section class="row">',
					'<h4>Declination</h4>',
					'<section class="column one-of-two declination">',
						'<table>',
							'<thead>',
								'<tr>',
									'<th scope="col">&nbsp;</th>',
									'<th scope="col" class="dec-absolute-sTime">Start Time</th>',
									'<th scope="col" class="dec-absolute-eTime">End Time</th>',
									'<th scope="col" class="dec-absolute-deg">Deg.</th>',
									'<th scope="col" class="dec-absolute-min">Min.</th>',
									'<th scope="col" class="dec-absolute-ordMin">Ord. Min.</th>',
									'<th scope="col" class="dec-baseline-min">Min.</th>',
									'<th scope="col" class="dec-baseline-nT">nT</th>',
									'<th scope="col" class="dec-baseline-observer>Observer</th>',
									'<th scope="col" class="dec-baseline-180-shift">180&#176; Shift</th>',
								'</tr>',
							'</thead>',
							'<tbody class="declination-reading">',
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
					'</section>',
				'</section>',
				'<section class="row">',
					'<h4>Horizontal Intensity</h4>',
					'<section class="column one-of-two horizontalIntensity">',
						'<table>',
							'<thead>',
								'<tr>',
									'<th scope="col">&nbsp;</th>',
									'<th scope="col" class="horizontal-sTime">Start Time</th>',
									'<th scope="col" class="horizontal-eTime">End Time</th>',
									'<th scope="col" class="horizontal-absValue">Abs. Value (nT)</th>',
									'<th scope="col" class="horizontal-ord">Ord.(nT)</th>',
									'<th scope="col" class="horizontal-baseValues">Baseline Values (nT)</th>',
									'<th scope="col" class="horizontal-observer">Observer</th>',
								'</tr>',
							'</thead>',
							'<tbody class="horizontal-intensity">',
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
					'</section>',
				'</section>',
				'<section class="row">',
					'<h4>Vertical Intensity</h4>',
					'<section class="column one-of-two verticalIntensity">',
						'<table>',
							'<thead>',
								'<tr>',
									'<th scope="col">&nbsp;</th>',
									'<th scope="col" class="vertical-intensity-sTime">Start Time</th>',
									'<th scope="col" class="vertical-intensity-eTime">End Time</th>',
									'<th scope="col" class="vertical-intensity-absValue">Abs. Value (nT)</th>',
									'<th scope="col" class="vertical-intensity-ord">Ord.(nT)</th>',
									'<th scope="col" class="vertical-intensity-baseValues">Baseline Values (nT)</th>',
									'<th scope="col" class="vertical-intensity-observer">Observer</th>',
								'</tr>',
							'</thead>',
							'<tbody class="vertical-intensity">',
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
					'</section>',
				'</section>',
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
	};


	return ObservationSummaryView;
});
