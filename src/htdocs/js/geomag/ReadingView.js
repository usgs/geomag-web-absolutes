/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/DeclinationView',
	'geomag/InclinationView',
	'geomag/MagnetometerOrdinatesView',
	'geomag/Measurement',
	'geomag/MeasurementView'
], function (
	View,
	Util,

	DeclinationView,
	InclinationView,
	MagnetometerOrdinatesView,
	Measurement,
	MeasurementView
) {
	'use strict';


	var DEFAULTS = {
	};


	var ReadingView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ReadingView.prototype = Object.create(View.prototype);


	ReadingView.prototype.render = function () {
		// TODO :: Render current model
	};

	ReadingView.prototype._initialize = function () {
		this._observation = this._options.observation;
		this._reading = this._options.reading;
		this._calculator = this._options.baselineCalculator;
		this._measurements = this._reading.getMeasurements();

		this._el.innerHTML = [
			'<section class="reading-view">',
				'<section class="declination-view-wrapper">',
					'<section class="declination-input">',
						'<table>',
							'<thead>',
								'<tr>',
									'<th scope="col">Name</th>',
									'<th scope="col">Time</th>',
									'<th scope="col">Deg</th>',
									'<th scope="col">Min</th>',
									'<th scope="col">Sec</th>',
								'</tr>',
							'</thead>',
							'<tbody>',
								'<tr class="first-mark-up"></tr>',
								'<tr class="first-mark-down"></tr>',
								'<tr class="west-down"></tr>',
								'<tr class="east-down"></tr>',
								'<tr class="west-up"></tr>',
								'<tr class="east-up"></tr>',
								'<tr class="second-mark-up"></tr>',
								'<tr class="second-mark-down"></tr>',
							'</tbody>',
						'</table>',
					'</section>',
					'<section class="declination-output"></section>',
				'</section>',
				'<section class="inclination-view-wrapper">',
					'</section class="inclination-input">',
					'</section>',
					'<section class="inclination-output"></section>',
				'<section class="magnetometer-ordinates-view-wrapper"></section>',
			'</section>'
		].join('');

		this._firstMarkUpView = new MeasurementView({
			el: this._el.querySelector('.first-mark-up'),
			measurement: this._measurements[Measurement.FIRST_MARK_UP][0]
		});

		this._firstMarkUpView = new MeasurementView({
			el: this._el.querySelector('.first-mark-down'),
			measurement: this._measurements[Measurement.FIRST_MARK_DOWN][0]
		});

		this._firstMarkUpView = new MeasurementView({
			el: this._el.querySelector('.west-down'),
			measurement: this._measurements[Measurement.WEST_DOWN][0]
		});

		this._firstMarkUpView = new MeasurementView({
			el: this._el.querySelector('.east-down'),
			measurement: this._measurements[Measurement.EAST_DOWN][0]
		});

		this._firstMarkUpView = new MeasurementView({
			el: this._el.querySelector('.west-up'),
			measurement: this._measurements[Measurement.WEST_UP][0]
		});

		this._firstMarkUpView = new MeasurementView({
			el: this._el.querySelector('.east-up'),
			measurement: this._measurements[Measurement.EAST_UP][0]
		});

		this._firstMarkUpView = new MeasurementView({
			el: this._el.querySelector('.second-mark-up'),
			measurement: this._measurements[Measurement.SECOND_MARK_UP][0]
		});

		this._firstMarkUpView = new MeasurementView({
			el: this._el.querySelector('.second-mark-down'),
			measurement: this._measurements[Measurement.SECOND_MARK_DOWN][0]
		});

		this._declinationView = new DeclinationView({
			el: this._el.querySelector('.declination-view-wrapper'),
			reading: this._reading,
			baselineCalculator: this._calculator
		});

		this._inclinationView = new InclinationView({
			el: this._el.querySelector('.inclination-view-wrapper'),
			reading: this._reading
		});

		this._magnetometerOrdinatesView = new MagnetometerOrdinatesView({
			el: this._el.querySelector('.magnetometer-ordinates-view-wrapper'),
			reading: this._reading
		});
	};


	return ReadingView;
});

