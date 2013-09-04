/*global define*/
define([
	'mvc/Util',
	'mvc/View'
], function (
	Util,
	View
) {

	'use strict';

	var DEFAULTS = {
		'baselineCalculator': null,
		'reading': null
	};

	/**
	 * Construct a new InclinationView
	 *
	 * @param option {Object}
	 *        view options.
	 * @param option.baselineCalculator {geomag.ObservationBaselineCalculator}
	 *        the calculator to use.
	 * @param option.reading {geomag.Reading}
	 *        the reading to display.
	 */
	var InclinationView = function (options) {
		options = Util.extend({}, DEFAULTS, options);

		View.call(this, options);
	};

	InclinationView.prototype = Object.create(View.prototype);

	/**
	 * Initialize view, and call render.
	 * @param options {Object} same as constructor.
	 */
	InclinationView.prototype.initialize = function (options) {
		this._options = options;

		// build the view skeleton
		this.el.innerHTML = [
				'<dl>',
					'<dt>Inclination</dt>',
					'<dd class="inclination"></dd>',
					'<dt>Horizontal Component</dt>',
					'<dd class="horizontalComponent"></dd>',
					'<dt>Vertical Component</dt>',
					'<dd class="verticalComponent"></dd>',
					'<dt>(SD-NU-180)*60</dt>',
					'<dd class="southDownMinusNorthUp"></dd>',
					'<dt>(ND-SU-180)*60</dt>',
					'<dd class="northDownMinusSouthUp"></dd>',
				'</dl>'
		].join('');

		this._inclination =
				this.el.querySelector('.inclination');
		this._horizontalComponent =
				this.el.querySelector('.horizontalComponent');
		this._verticalComponent =
				this.el.querySelector('.verticalComponent');
		this._southDownMinusNorthUp =
				this.el.querySelector('.southDownMinusNorthUp');
		this._northDownMinusSouthUp =
				this.el.querySelector('.northDownMinusSouthUp');

		// bind to a reading model change
		this._options.reading.on('change', this.render, this);

		// render the view
		this.render();
	};

	/**
	 * Update the view based on the current reading.
	 */
	InclinationView.prototype.render = function () {
		var baselineCalculator = this._options.baselineCalculator,
		    reading = this._options.reading;

		this._inclination.innerHTML =
				baselineCalculator.inclination(reading);
		this._horizontalComponent.innerHTML =
				baselineCalculator.horizontalComponent(reading);
		this._verticalComponent.innerHTML =
				baselineCalculator.verticalComponent(reading);
		this._southDownMinusNorthUp.innerHTML =
				baselineCalculator.southDownMinusNorthUp(reading);
		this._northDownMinusSouthUp.innerHTML =
				baselineCalculator.northDownMinusSouthUp(reading);
	};

	// return the constructor
	return InclinationView;

});