/* global define */
define([
	'mvc/View',
	'mvc/Collection',
	'util/Util',

	'geomag/ObservatoryFactory',
	'geomag/Observation',
	'geomag/ObservationMetaView',
	'geomag/ReadingGroupView',
	'geomag/ObservationBaselineCalculator',
	'geomag/RealtimeDataFactory'
], function (
	View,
	Collection,
	Util,

	ObservatoryFactory,
	Observation,
	ObservationMetaView,
	ReadingGroupView,
	ObservationBaselineCalculator,
	RealtimeDataFactory
) {
	'use strict';


	var DEFAULTS = {
		observationId: null,
		factory: new ObservatoryFactory(),
		baselineCalculator: new ObservationBaselineCalculator(),
		realtimeDataFactory: new RealtimeDataFactory()
	};


	var ObservationView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ObservationView.prototype = Object.create(View.prototype);


	ObservationView.prototype.render = function () {
		// nothing to render, sub views handle everything
	};

	/**
	 * Initialize the observation view.
	 */
	ObservationView.prototype._initialize = function () {
		var el = this._el,
		    factory = this._options.factory,
		    calculator = this._options.baselineCalculator,
		    realtimeDataFactory = this._options.realtimeDataFactory;

		el.innerHTML = [
			'<section class="observation-view">',
				'<section class="observation-meta-wrapper"></section>',
				'<section class="reading-group-view-wrapper"></section>',
			'</section>'
		].join('');

		this._calculator = calculator;
		this._realtimeDataFactory = realtimeDataFactory;
		this._observation = null;
		this._observatories = null;
		this._observationMetaView = null;
		this._readingGroupView = null;

		// load observation
		factory.getObservation({
			id: this._options.observationId || null,
			success: this._setObservation.bind(this)
		});
	};

	/**
	 * Called when observation has been loaded.
	 *
	 * @param observation {Observation}
	 *        result of ObservatoryFactory.getObservatory().
	 */
	ObservationView.prototype._setObservation = function (observation) {
		var el = this._el,
		    calculator = this._calculator;

		this._observation = observation;
		// create reading group view
		this._readingGroupView = new ReadingGroupView({
			el: el.querySelector('.reading-group-view-wrapper'),
			observation: observation,
			baselineCalculator: calculator
		});

		// load observatories for meta view
		observation.getObservatories({
			success: this._setObservatories.bind(this)
		});

		// bind realtime data factory and measurements.
		this._bindRealtimeDataFactory();
	};


	/**
	 * Called when observatories have been loaded.
	 *
	 * @param observatories {Array<Object>}
	 *        result of ObservatoryFactory.getObservatories().
	 */
	ObservationView.prototype._setObservatories = function (observatories) {
		var el = this._el,
		    observation = this._observation,
		    calculator = this._calculator,
		    observatory_id,
		    observatory;

		// convert to collection
		this._observatories = observatories = new Collection(observatories);
		// bind before select code below, so this will run for first select
		observatories.on('select', this._onObservatorySelect, this);
		// select observation observatory if set
		observatory_id = observation.get('observatory_id');
		if (observatory_id !== null) {
			observatory = observatories.get(observatory_id);
			if (observatory !== null) {
				observatories.select(observatory);
			}
		}

		// create observation meta view
		this._observationMetaView = new ObservationMetaView({
			el: el.querySelector('.observation-meta-wrapper'),
			observation: observation,
			observatories: observatories,
			calculator: calculator
		});
	};

	/**
	 * Called when an observatory is selected.
	 */
	ObservationView.prototype._onObservatorySelect = function () {
		var code = null,
		    observatory;
		observatory = this._observatories.getSelected();
		if (observatory !== null) {
			code = observatory.get('code');
		}
		this._realtimeDataFactory.set({observatory: code});
	};

	/**
	 * Bind measurements to realtimedata factory.
	 */
	ObservationView.prototype._bindRealtimeDataFactory = function () {
		var realtimeDataFactory = this._realtimeDataFactory,
		    observation = this._observation,
		    readings,
		    reading,
		    r,
		    rlen,
		    measurements,
		    measurement,
		    m,
		    mlen,
		    callback;

		readings = observation.get('readings').data();
		for (r = 0, rlen = readings.length; r < rlen; r++) {
			reading = readings[r];
			measurements = reading.get('measurements').data();
			for (m = 0, mlen = measurements.length; m < mlen; m++) {
				measurement = measurements[m];
				callback = this._getRealtimeData.bind(this, measurement);
				measurement.on('change:time', callback);
				realtimeDataFactory.on('change:observatory', callback);
			}
		}
	};

	/**
	 * Get realtime data for one measurement.
	 *
	 * @param measurement {Measurement}
	 *        the measurement object.
	 */
	ObservationView.prototype._getRealtimeData = function (measurement) {
		var realtimeDataFactory = this._realtimeDataFactory,
		    observatory = realtimeDataFactory.get('observatory'),
		    timeMs = measurement.get('time'),
		    time;

		if (observatory === null || timeMs === null) {
			// need more information
			return;
		}
		time = Math.round(timeMs / 1000);
		realtimeDataFactory.getRealtimeData({
			starttime: time,
			endtime: time,
			success: measurement.setRealtimeData.bind(measurement)
		});
	};


	// return constructor
	return ObservationView;
});
