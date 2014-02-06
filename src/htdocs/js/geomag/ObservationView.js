/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/Observation',
	'geomag/ReadingGroupView',
	'geomag/BaselineCalculator'
], function (
	View,
	Util,

	Observation,
	ReadingGroupView,
	ObservationBaselineCalculator
) {
	'use strict';


	var DEFAULTS = {
	};


	var ObservationView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ObservationView.prototype = Object.create(View.prototype);


	ObservationView.prototype.render = function () {
		// TODO :: Render current model
	};

	ObservationView.prototype._initialize = function () {
		this._observation = this._options.observation || new Observation();
		this._calculator = this._options.baselineCalculator ||
				new ObservationBaselineCalculator();

		this._el.innerHTML = [
			'<section class="observation-view">',
				'<section class="observation-meta-wrapper"></section>',
				'<section class="reading-group-view-wrapper"></section>',
			'</section>'
		].join('');

		this._readingGroupView = new ReadingGroupView({
			el: this._el.querySelector('.reading-group-view-wrapper'),
			observation: this._observation,
			baselineCalculator: this._calculator
		});
	};


	return ObservationView;
});
