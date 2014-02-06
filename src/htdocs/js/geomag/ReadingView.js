/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/DeclinationView',
	'geomag/InclinationView',
	'geomag/MagnetometerOrdinatesView'
], function (
	View,
	Util,

	DeclinationView,
	InclinationView,
	MagnetometerOrdinatesView
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

		this._el.innerHTML = [
			'<section class="reading-view">',
				'<section class="declination-view-wrapper"></section>',
				'<section class="inclination-view-wrapper"></section>',
				'<section class="magnetometer-ordinates-view-wrapper"></section>',
			'</section>'
		].join('');

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

