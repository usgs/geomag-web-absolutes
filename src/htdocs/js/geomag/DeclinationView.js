/*global define*/
define([
	'mvc/Util',
	'mvc/View'
], function (
	Util,
	View
) {
	'use strict';

	// default options
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
		options = Util.extend({}, DEFAULT_OPTIONS, options);

		// call parent constructor
		View.call(this, options);
	};

	// extend View class
	DeclinationView.prototype = Object.create(View.prototype);


	/**
	 * Initialize view, and call render.
	 * @param options {Object} same as constructor.
	 */
	DeclinationView.prototype.initialize = function (options) {
		this._options = options;

		// view template
		this.el.innerHTML = [
			'<dl class="tabular">',
				'<dt>Magnetic South Meridian</dt>',
				'<dd class="magneticSouthMeridian"></dd>',
				'<dt>Mean Mark</dt>',
				'<dd class="meanMark"></dd>',
				'<dt>Magnetic Azimuth of Mark</dt>',
				'<dd class="magneticAzimuthOfMark"></dd>',
				'<dt>True Azimuth of Mark</dt>',
				'<dd class="trueAzimuthOfMark"></dd>',
				'<dt>Magnetic Declination</dt>',
				'<dd class="magneticDeclination"></dd>',
				'<dt>',
					'(<abbr title="West Up">WU</abbr> - ',
					'<abbr title="East Down">ED</abbr>)',
					' * 60',
				'</dt>',
				'<dd class="westUpMinusEastDown"></dd>',
				'<dt>',
					'(<abbr title="East Up">EU</abbr> - ',
					'<abbr title="West Down">WD</abbr>)',
					' * 60',
				'</dt>',
				'<dd class="eastUpMinusWestDown"></dd>',
				'<dt>F mean</dt>',
				'<dd class="fMean"></dd>',
				'<dt>Pier Correction</dt>',
				'<dd class="pierCorrection"></dd>',
				'<dt>Corrected F</dt>',
				'<dd class="correctedF"></dd>',
			'</dl>'
		].join('');

		// save references to elements that will be updated during render
		this._magneticSouthMeridian = this.el.querySelector(
				'.magneticSouthMeridian');
		this._meanMark = this.el.querySelector('.meanMark');
		this._magneticAzimuthOfMark = this.el.querySelector(
				'.magneticAzimuthOfMark');
		this._trueAzimuthOfMark = this.el.querySelector('.trueAzimuthOfMark');
		this._magneticDeclination = this.el.querySelector('.magneticDeclination');
		this._westUpMinusEastDown = this.el.querySelector('.westUpMinusEastDown');
		this._eastUpMinusWestDown = this.el.querySelector('.eastUpMinusWestDown');
		this._fMean = this.el.querySelector('.fMean');
		this._pierCorrection = this.el.querySelector('.pierCorrection');
		this._correctedF = this.el.querySelector('.correctedF');

		// when reading changes render view
		this._options.reading.on('change', this.render, this);

		// render current reading
		this.render();
	};

	/**
	 * Update view based on current reading values.
	 */
	DeclinationView.prototype.render = function () {
		var calculator = this._options.baselineCalculator,
		    reading = this._options.reading;

		this._magneticSouthMeridian.innerHTML =
				calculator.magneticSouthMeridian(reading);
		this._meanMark.innerHTML = calculator.meanMark(reading);
		this._magneticAzimuthOfMark.innerHTML =
				calculator.magneticAzimuthMark(reading);
		this._trueAzimuthOfMark.innerHTML = calculator.trueAzimuthOfMark(reading);
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


	// return constructor
	return DeclinationView;
});
