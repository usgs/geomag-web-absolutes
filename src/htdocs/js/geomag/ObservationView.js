/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/ObservatoryFactory',
	'geomag/Observation',
	'geomag/ObservationMetaView',
	'geomag/ReadingGroupView',
	'geomag/BaselineCalculator'
], function (
	View,
	Util,

	ObservatoryFactory,
	Observation,
	ObservationMetaView,
	ReadingGroupView,
	ObservationBaselineCalculator
) {
	'use strict';


	var DEFAULTS = {
		observationId: null,
		factory: new ObservatoryFactory()
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
		var _this = this,
		    el = this._el,
		    factory = this._options.factory;

		el.innerHTML = [
			'<section class="observation-view">',
				'<section class="observation-meta-wrapper"></section>',
				'<section class="reading-group-view-wrapper"></section>',
			'</section>'
		].join('');

		this._calculator = this._options.baselineCalculator ||
						new ObservationBaselineCalculator();
		this._observation = null;
		this._observationMetaView = null;
		this._readingGroupView = null;

		// load observation
		factory.getObservation({
			id: this._options.observationId || null,
			success: function (observation) {
				_this._observation = observation;

				_this._observationMetaView = new ObservationMetaView({
					el: el.querySelector('.observation-meta-wrapper'),
					observation: observation
				});

				_this._readingGroupView = new ReadingGroupView({
					el: el.querySelector('.reading-group-view-wrapper'),
					observation: observation,
					baselineCalculator: _this._calculator
				});
			}
		});
	};


	return ObservationView;
});
