/*global define*/
define([
	'mvc/View',
	'util/Util',

	'geomag/Measurement',
	'geomag/Reading'
], function (
	View,
	Util,

	Measurement,
	Reading
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
		this._reading = this._options.reading;
		this._calculator = this._options.baselineCalculator;
		this._measurements = this._reading.getMeasurements();

		this._el.classList.add('declination-view');
		this._el.innerHTML = [
			'<dl>',
				'<dt class="mag-s-meridian">Magnetic South Meridian</dt>',
				'<dd class="mag-s-meridian-value">------</dd>',
				'<dt class="mean-mark">Mean Mark</dt>',
				'<dd class="mean-mark-value">------</dd>',
				'<dt class="mag-az-of-mark">Magnetic Azimuth of Mark</dt>',
				'<dd class="mag-az-of-mark-value">------</dd>',
				'<dt class="true-az-of-mark">True Azimuth of Mark</dt>',
				'<dd class="true-az-of-mark-value">------</dd>',
				'<dt class="mag-declination">Magnetic Declination</dt>',
				'<dd class="mag-declination-value">------</dd>',

				'<dt class="west-up-minus-east-down">(WU - ED) * 60</dt>',
				'<dd class="west-up-minus-east-down-value">----</dd>',
				'<dt class="east-up-minus-west-down">(EU - WD) * 60</dt>',
				'<dd class="east-up-minus-west-down-value">----</dd>',

				'<dt class="f-mean">F Mean</dt>',
				'<dd class="f-mean-value">--------</dd>',
				'<dt class="pier-correction">Pier Correction</dt>',
				'<dd class="pier-correction-value">-----</dd>',
				'<dt class="corrected-f">Corrected F</dt>',
				'<dd class="corrected-f-value">--------</dd>',
			'</dl>'
		].join('');

		// save references to elements that will be updated during render
		this._magneticSouthMeridian = this._el.querySelector('.mag-s-meridian-value');
		this._meanMark = this._el.querySelector('.mean-mark-value');
		this._magneticAzimuthOfMark = this._el.querySelector('.mag-az-of-mark-value');
		this._trueAzimuthOfMark = this._el.querySelector('.true-az-of-mark-value');
		this._magneticDeclination = this._el.querySelector(
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

		// watches for changes in pier/mark
		this._calculator.on('change', this.render, this);

		// render current reading
		this.render();
	};

	/**
	 * Update view based on current reading values.
	 */
	DeclinationView.prototype.render = function () {

		var calculator = this._calculator,
		    reading = this._reading;

		this._magneticSouthMeridian.innerHTML =
				this._formatDegreesMinutes(calculator.magneticSouthMeridian(reading));
		this._meanMark.innerHTML = '<span class="deg">' +
				calculator.meanMark(reading).toFixed(2) + '</span>';
		this._magneticAzimuthOfMark.innerHTML = '<span class="deg">' +
				calculator.magneticAzimuthMark(reading).toFixed(2) + '</span>';
		this._trueAzimuthOfMark.innerHTML = '<span class="deg">' +
				calculator.trueAzimuthOfMark() + '</span>';
		this._magneticDeclination.innerHTML =
				this._formatDegreesMinutes(calculator.magneticDeclination(reading));

		this._westUpMinusEastDown.innerHTML =
				calculator.westUpMinusEastDown(reading).toFixed(2);
		this._eastUpMinusWestDown.innerHTML =
				calculator.eastUpMinusWestDown(reading).toFixed(2);

		this._fMean.innerHTML = calculator.meanF(reading).toFixed(2);
		this._pierCorrection.innerHTML = calculator.pierCorrection();
		this._correctedF.innerHTML = calculator.correctedF(reading).toFixed(2);
	};


	DeclinationView.prototype._formatDegreesMinutes = function (angle) {
		var buf = [],
		    degrees,
		    minutes;

		degrees = parseInt(angle, 10);
		minutes = (angle - degrees) * 60;

		buf.push(
				'<span class="deg">', angle.toFixed(2), '</span>',
				'<span class="repeat">',
					'<span class="deg">', degrees, '</span>',
					'&nbsp;',
					'<span class="minutes">', minutes.toFixed(2), '</span>',
				'</span>');

		return buf.join('');
	};

	return DeclinationView;
});
