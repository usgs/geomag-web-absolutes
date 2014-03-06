/*global define*/
define([
	'mvc/View',
	'util/Util',

	'geomag/Formatter',
	'geomag/Measurement'
], function (
	View,
	Util,

	Format,
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
			'</dl>'
		].join('');

		// save references to elements that will be updated during render
		this._magneticSouthMeridian =
				this._el.querySelector('.mag-s-meridian-value');
		this._meanMark = this._el.querySelector('.mean-mark-value');
		this._magneticAzimuthOfMark =
				this._el.querySelector('.mag-az-of-mark-value');
		this._trueAzimuthOfMark = this._el.querySelector('.true-az-of-mark-value');
		this._magneticDeclination = this._el.querySelector(
				'.mag-declination-value');

		this._westUpMinusEastDown = this._el.querySelector(
				'.west-up-minus-east-down-value');
		this._eastUpMinusWestDown = this._el.querySelector(
				'.east-up-minus-west-down-value');

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
				Format.degreesAndDegreesMinutes(calculator.magneticSouthMeridian(reading));
		this._meanMark.innerHTML = Format.degrees(calculator.meanMark(reading));
		this._magneticAzimuthOfMark.innerHTML =
				Format.degrees(calculator.magneticAzimuthMark(reading));
		this._trueAzimuthOfMark.innerHTML =
				Format.rawDegrees(calculator.trueAzimuthOfMark());
		this._magneticDeclination.innerHTML =
				Format.degreesAndDegreesMinutes(calculator.magneticDeclination(reading));

		this._westUpMinusEastDown.innerHTML =
				Format.minutes(calculator.westUpMinusEastDown(reading));
		this._eastUpMinusWestDown.innerHTML =
				Format.minutes(calculator.eastUpMinusWestDown(reading));
	};

	return DeclinationView;
});
