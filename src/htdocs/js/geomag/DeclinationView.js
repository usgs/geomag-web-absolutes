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
		this._calculator = this._options.baselineCalculator;
		this._measurements = this._reading.getMeasurements();

		this._el.classList.add('declination-view');
		this._el.innerHTML = [
			'<dl>',
				'<dt class="mag-s-meridian">Magnetic South Meridian</dt>',
				'<dd class="mag-s-meridian-value angle">------</dd>',

				'<dt class="mean-mark">Mean Mark</dt>',
				'<dd class="mean-mark-value angle">------</dd>',

				'<dt class="mag-az-of-mark">Magnetic Azimuth of Mark</dt>',
				'<dd class="mag-az-of-mark-value angle">------</dd>',

				'<dt class="true-az-of-mark">True Azimuth of Mark</dt>',
				'<dd class="true-az-of-mark-value angle">------</dd>',

				'<dt class="mag-declination">Magnetic Declination</dt>',
				'<dd class="mag-declination-value angle">------</dd>',

				'<dt class="west-up-minus-east-down">(WU - ED) * 60</dt>',
				'<dd class="west-up-minus-east-down-value minutes">----</dd>',

				'<dt class="east-up-minus-west-down">(EU - WD) * 60</dt>',
				'<dd class="east-up-minus-west-down-value minutes">----</dd>',

				'<dt class="f-mean">F Mean</dt>',
				'<dd class="f-mean-value nt">--------</dd>',

				'<dt class="pier-correction">Pier Correction</dt>',
				'<dd class="pier-correction-value nt">-----</dd>',

				'<dt class="corrected-f">Corrected F</dt>',
				'<dd class="corrected-f-value nt">--------</dd>',
			'</dl>'
		].join('');

		// save references to elements that will be updated during render
		this._magSMeridianAngle = this._el.querySelector('.mag-s-meridian-value');

		this._meanMark = this._el.querySelector('.mean-mark-value');

		this._magneticAzOfMark = this._el.querySelector('.mag-az-of-mark-value');
		this._trueAzOfMark = this._el.querySelector('.true-az-of-mark-value');

		this._magDeclinationAngle = this._el.querySelector(
		    '.mag-declination-value');

		this._westUpMinusEastDown = this._el.querySelector(
				'.west-up-minus-east-down-value');
		this._eastUpMinusWestDown = this._el.querySelector(
				'.east-up-minus-west-down-value');

		this._fMean = this._el.querySelector('.f-mean-value');
		this._pierCorrection = this._el.querySelector('.pier-correction-value');
		this._correctedF = this._el.querySelector('.corrected-f-value');

		// when reading changes render view
		this._options.reading.on('change', this.render, this);

		// also render when any related inputs change
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

		//this._observation.on('mark-selected', this.render, this);
		this._calculator.on('change', this.render, this);

		// render current reading
		this.render();
	};

	/**
	 * Update view based on current reading values.
	 */
	DeclinationView.prototype.render = function () {

		var calculator = this._calculator,
		    reading = this._reading,
		    observation = this._observation,
		    observatory = observation.get('observatory'),
		    magSMeridianAngle = calculator.magneticSouthMeridian(reading),
		    magSMeridianDegrees = parseInt(magSMeridianAngle, 10),
		    magSMeridianMinutes = (magSMeridianAngle - magSMeridianDegrees)*60,
		    magDeclinationAngle = calculator.magneticDeclination(reading),
		    magDeclinationDegrees = parseInt(magDeclinationAngle, 10),
		    magDeclinationMinutes = (magDeclinationAngle -
		        magDeclinationDegrees) * 60;

		this._magSMeridianAngle.innerHTML = '<span class="deg">' +
		    magSMeridianAngle.toFixed(2) +
		    '</span><span class="repeat"><span class="deg">' +
		    magSMeridianDegrees + '</span>&nbsp;<span class="minutes">' +
		    magSMeridianMinutes.toFixed(2) + '</span></span>';

		this._meanMark.innerHTML = '<span class="deg">' +
		    calculator.meanMark(reading).toFixed(2) + '</span>';

		this._magneticAzOfMark.innerHTML = '<span class="deg">' +
		    calculator.magneticAzimuthMark(reading).toFixed(2) + '</span>';

		this._trueAzOfMark.innerHTML = '<span class="deg">' +
		    calculator.trueAzimuthOfMark(observatory).toFixed(2) + '</span>';

		this._magDeclinationAngle.innerHTML = '<span class="deg">' +
		    magDeclinationAngle.toFixed(2) +
		    '</span><span class="repeat"><span class="deg">' +
		    magDeclinationDegrees + '</span>&nbsp;<span class="minutes">' +
	      magDeclinationMinutes.toFixed(2) + '</span></span>';

		this._westUpMinusEastDown.innerHTML =
		    calculator.westUpMinusEastDown(reading).toFixed(2);
		this._eastUpMinusWestDown.innerHTML =
		    calculator.eastUpMinusWestDown(reading).toFixed(2);

		this._fMean.innerHTML = calculator.meanF(reading).toFixed(2);

		this._pierCorrection.innerHTML =
		    calculator.pierCorrection(observatory).toFixed(2);

		this._correctedF.innerHTML = calculator.correctedF(reading).toFixed(2);
	};


	return DeclinationView;
});
