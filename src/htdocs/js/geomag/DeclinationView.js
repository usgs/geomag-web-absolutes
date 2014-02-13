/*global define*/
define([
	'mvc/View',
	'util/Util',

	'geomag/Reading',
	'geomag/Measurement'
], function (
	View,
	Util,

	Reading,
	Measurement
) {
	'use strict';


	var DEFAULT_OPTIONS = {
		'baselineCalculator': null,
		'reading': null
	};


	/**
	 * Construct a new DeclinationView.
	 *
	 * @param option {Object}
	 *        view options.
	 * @param option.baselineCalculator {geomag.ObservationBaselineCalculator}
	 *        the calculator to use.
	 * @param option.reading {geomag.Reading}
	 *        the reading to display.
	 */
	var DeclinationView = function (options) {
		this._options = Util.extend({}, DEFAULT_OPTIONS, options);
		View.call(this, this._options);
	};
	DeclinationView.prototype = Object.create(View.prototype);


	/**
	 * Initialize view, and call render.
	 * @param options {Object} same as constructor.
	 */
	DeclinationView.prototype._initialize = function () {
		this._observation = this._options.observation;
		this._reading = this._options.reading;
		this._calculator = this._options.observationBaselineCalculator;
		this._measurements = this._reading.getMeasurements();

		this._el.classList.add('declination-view');
		this._el.innerHTML = [
			'<table>',
				'<thead>',
					'<tr>',
						'<th scope="col">&nbsp;</th>',
						'<th scope="col" class="declination-angles">Full Angle</th>',
						'<th scope="col" class="declination-degrees">Deg</th>',
						'<th scope="col" class="declination-minutes">Min</th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'<tr class="mag-south-meridian">',
						'<th scope="row">Magnetic South Meridian</th>',
						'<td class="mag-south-meridian-angle">------</td>',
						'<td class="mag-south-meridian-degrees">---</td>',
						'<td class="mag-south-meridian-minutes">----</td>',
					'</tr>',
					'<tr class="mean-mark">',
						'<th scope="row">Mean Mark</th>',
						'<td class="mean-mark-angle">------</td>',
						'<td class="mean-mark-degrees">---</td>',
						'<td class="mean-mark-minutes">----</td>',
					'</tr>',
					'<tr class="mag-az-of-mark">',
						'<th scope="row">Magnetic Azimuth of Mark</th>',
						'<td class="mag-az-of-mark-angle">------</td>',
						'<td class="mag-az-of-mark-degrees">---</td>',
						'<td class="mag-az-of-mark-minutes">----</td>',
					'</tr>',
					'<tr class="true-az-of-mark">',
						'<th scope="row">True Azimuth of Mark</th>',
						'<td class="true-az-of-mark-angle">------</td>',
						'<td class="true-az-of-mark-degrees">---</td>',
						'<td class="true-az-of-mark-minutes">----</td>',
					'</tr>',
					'<tr class="mag-declination">',
						'<th scope="row">Magnetic Declination</th>',
						'<td class="mag-declination-angle">------</td>',
						'<td class="mag-declination-degrees">---</td>',
						'<td class="mag-declination-minutes">----</td>',
					'</tr>',
					'<tr class="west-up-minus-east-down">',
						'<th scope="row">(WU - ED) * 60</th>',
						'<td class="west-up-minus-east-down-angle">------</td>',
						'<td class="west-up-minus-east-down-degrees">---</td>',
						'<td class="west-up-minus-east-down-minutes">----</td>',
					'</tr>',
					'<tr class="east-up-minus-west-down">',
						'<th scope="row">(EU - WD) * 60</th>',
						'<td class="east-up-minus-west-down-angle">------</td>',
						'<td class="east-up-minus-west-down-degrees">---</td>',
						'<td class="east-up-minus-west-down-minutes">----</td>',
					'</tr>',
				'</tbody>',
			'</table>',

			'<table class="f-table">',
				'<tbody>',
					'<tr class="f-mean">',
						'<th scope="row">F Mean</th>',
						'<td class="f-mean-nt">--------</td>',
					'</tr>',
					'<tr class="pier-correction">',
						'<th scope="row">Pier Correction</th>',
						'<td class="pier-correction-nt">-----</td>',
					'</tr>',
					'<tr class="corrected-f">',
						'<th scope="row">Corrected F</th>',
						'<td class="corrected-f-nt">--------</td>',
					'</tr>',
				'</tbody>',
			'</table>'
		].join('');

		// save references to elements that will be updated during render
		this._magSMeridianAngle = this._el.querySelector(
		    '.mag-south-meridian-angle');
		this._magSMeridianDegrees = this._el.querySelector(
		    '.mag-south-meridian-degrees');
		this._magSMeridianMinutes = this._el.querySelector(
		    '.mag-south-meridian-minutes');

		this._meanMark = this._el.querySelector('.mean-mark-angle');

		this._magneticAzOfMark = this._el.querySelector('.mag-az-of-mark-angle');

		this._trueAzOfMark = this._el.querySelector('.true-az-of-mark-angle');

		this._magneticDeclination = this._el.querySelector(
		    '.mag-declination-angle');
		this._magneticDeclination = this._el.querySelector(
		    '.mag-declination-degrees');
		this._magneticDeclination = this._el.querySelector(
		    '.mag-declination-minutes');

		this._westUpMinusEastDown = this._el.querySelector(
				'.west-up-minus-east-down-minutes');
		this._eastUpMinusWestDown = this._el.querySelector(
				'.east-up-minus-west-down-minutes');

		this._fMean = this._el.querySelector('.f-mean-nt');
		this._pierCorrection = this._el.querySelector('.pier-correction-nt');
		this._correctedF = this._el.querySelector('.corrected-f-nt');

		// when reading changes render view
		this._options.reading.on('change', this.render, this);

		this._measurements[Measurement.FIRST_MARK_UP][0].on(
				'change', this.render, this);
		this._measurements[Measurement.FIRST_MARK_DOWN][0].on(
				'change', this.render, this);

		this._measurements[Measurement.WEST_DOWN][0].on(
				'change', this.render, this);
		this._measurements[Measurement.EAST_DOWN][0].on(
				'change', this.render, this);
		this._measurements[Measurement.WEST_UP][0].on(
				'change', this.render, this);
		this._measurements[Measurement.EAST_UP][0].on(
				'change', this.render, this);

		this._measurements[Measurement.SECOND_MARK_UP][0].on(
				'change', this.render, this);
		this._measurements[Measurement.SECOND_MARK_DOWN][0].on(
				'change', this.render, this);

		// render current reading
		//this.render();
	};

	/**
	 * Update view based on current reading values.
	 */
	DeclinationView.prototype.render = function () {
		var calculator = this._calculator,
		    reading = this._reading,
		    magSMeridianAngle = calculator.magneticSouthMeridian(reading),
		    magSMeridianDegrees = parseInt(magSMeridianAngle, 10),
		    magSMeridianMinutes = parseFloat((magSMeridianAngle -
						magSMeridianDegrees)*60);

		this._magSMeridianAngle.innerHTML = magSMeridianAngle;
		this._magSMeridianDegrees.innerHTML = magSMeridianDegrees;
		this._magSMeridianMinutes.innerHTML = magSMeridianMinutes;

		this._meanMark.innerHTML = calculator.meanMark(reading);
		this._magneticAzOfMark.innerHTML = calculator.magneticAzMark(reading);
		this._trueAzOfMark.innerHTML = calculator.trueAzOfMark(reading);
		this._magneticDeclination.innerHTML =
				calculator.magneticDeclination(reading);
		this._westUpMinusEastDown.innerHTML =
				calculator.westUpMinusEastDown(reading);
		this._eastUpMinusWestDown.innerHTML =
				calculator.eastUpMinusWestDown(reading);
		this._fMean.innerHTML = calculator.fMean(reading);
		this._pierCorrection.innerHTML = calculator.pierCorrection(reading);
		this._correctedF.innerHTML = calculator.correctedF(reading);
	};


	return DeclinationView;
});
