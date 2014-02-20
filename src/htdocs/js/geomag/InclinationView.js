/* global define */
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
	 * Construct a new InclinationView.
	 *
	 * @param option {Object}
	 *        view options.
	 * @param option.baselineCalculator {geomag.ObservationBaselineCalculator}
	 *        the calculator to use.
	 * @param option.reading {geomag.Reading}
	 *        the reading to display.
	 */
	var InclinationView = function (options) {
		this._options = Util.extend({}, DEFAULT_OPTIONS, options);
		View.call(this, this._options);
	};
	InclinationView.prototype = Object.create(View.prototype);


	/**
	 * Initialize view, and call render.
	 * @param options {Object} same as constructor.
	 */
	InclinationView.prototype._initialize = function () {
		this._observation = this._options.observation;
		this._reading = this._options.reading;
		this._calculator = this._options.baselineCalculator;
		this._measurements = this._reading.getMeasurements();

		this._el.classList.add('inclination-view');
		this._el.innerHTML = [
			'<dl>',
				'<dt class="inclination">Inclination</dt>',
				'<dd class="inclination-value">------</dd>',
				'<dt class="horizontal-component">Horizontal Component</dt>',
				'<dd class="horizontal-component-value">------</dd>',
				'<dt class="vertical-component">Vertical Component</dt>',
				'<dd class="vertical-component-value">------</dd>',

				'<dt class="south-down-minus-north-up">(SD - NU - 180) * 60</dt>',
				'<dd class="south-down-minus-north-up-value">----</dd>',
				'<dt class="north-down-minus-south-up">(ND - SU - 180) * 60</dt>',
				'<dd class="north-down-minus-south-up-value">----</dd>',
			'</dl>'
		].join('');

		// save references to elements that will be updated during render
		this._inclinationAngle = this._el.querySelector('.inclination-value');
		this._horizontalComponent =
				this._el.querySelector('.horizontal-component-value');
		this._verticalComponent =
				this._el.querySelector('.vertical-component-value');

		this._southDownMinusNorthUp = this._el.querySelector(
				'.south-down-minus-north-up-value');
		this._northDownMinusSouthUp = this._el.querySelector(
				'.north-down-minus-south-up-value');

		// when reading changes render view
		this._options.reading.on('change', this.render, this);

		// also render when any related inputs change
		this._measurements[Measurement.SOUTH_DOWN][0].on(
				'change', this.render, this);
		this._measurements[Measurement.NORTH_UP][0].on(
				'change', this.render, this);
		this._measurements[Measurement.SOUTH_UP][0].on(
				'change', this.render, this);
		this._measurements[Measurement.NORTH_DOWN][0].on(
				'change', this.render, this);

		// watches for changes in pier/mark
		this._calculator.on('change', this.render, this);

		// render current reading
		this.render();
	};

	/**
	 * Update view based on current reading values.
	 */
	InclinationView.prototype.render = function () {
		var calculator = this._calculator,
		    reading = this._reading;

		this._inclinationAngle.innerHTML =
				this._formatDegreesMinutes(calculator.inclination(reading));

		this._horizontalComponent.innerHTML = '<span class="deg">' +
				calculator.horizontalComponent(reading).toFixed(2) + '</span>';
		this._verticalComponent.innerHTML = '<span class="deg">' +
				calculator.verticalComponent(reading).toFixed(2) + '</span>';

		this._southDownMinusNorthUp.innerHTML =
				calculator.southDownMinusNorthUp(reading).toFixed(2);
		this._northDownMinusSouthUp.innerHTML =
				calculator.northDownMinusSouthUp(reading).toFixed(2);
	};


	InclinationView.prototype._formatDegreesMinutes = function (angle) {
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

	return InclinationView;
});
