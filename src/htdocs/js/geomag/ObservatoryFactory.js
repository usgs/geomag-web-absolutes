/* global define */
define([
	'util/Util',
	'util/Xhr',
	'mvc/Collection',

	'geomag/Observatory',
	'geomag/Instrument',
	'geomag/Pier',
	'geomag/Mark',
	'geomag/Observation',
	'geomag/Reading',
	'geomag/Measurement'
], function (
	Util,
	Xhr,
	Collection,

	Observatory,
	Instrument,
	Pier,
	Mark,
	Observation,
	Reading,
	Measurement
) {
	'use strict';


	// default options.
	var DEFAULTS = {
		observatorySummaryUrl: 'observatory_summary_feed.php',
		observatoryDetailUrl: 'observatory_detail_feed.php',
		observationDetailUrl: 'observation_data.php'
	};


	/**
	 * Construct a new ObservatoryFactory.
	 *
	 * @param options {Object}
	 *        factory options.
	 * @param options.observatorySummaryUrl {String}
	 *        url for observatory summary feed.
	 *        default 'observatory_summary_feed.php'.
	 * @param options.observatoryDetailUrl {String}
	 *        url for observatory detail feed, should expect id as a GET parameter.
	 *        default 'observatory_detail_feed.php'.
	 * @param options.observationDetailUrl {String}
	 *        url for observation detail feed, should expect id as a GET parameter.
	 *        default 'observation_data.php'.
	 */
	var ObservatoryFactory = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
	};


	/**
	 * Get a list of observatories
	 *
	 * @param options {Object}
	 *        method options.
	 * @param options.success {Function(Array<ObservationSummary>)}
	 *        called with loaded observatories.
	 * @param options.error {Function}
	 *        called when errors loading observatories.
	 */
	ObservatoryFactory.prototype.getObservatories = function(options) {
		var _this = this;
		Xhr.ajax({
			url: this._options.observatorySummaryUrl,
			success: function (data) {
				var i, len;
				for (i = 0, len = data.length; i < len; i++) {
					data[i] = new ObservatorySummary(_this, data[i]);
				}
				options.success(data);
			},
			error: options.error || function () {}
		});
	};

	/**
	 * Get an observatory detail.
	 *
	 * @param options {Object}
	 *        method options.
	 * @param options.id {Integer|null}
	 *        when null, a new Observatory is created.
	 *        otherwise, load Observatory with specified id.
	 * @param options.success {Function(Observatory)}
	 *        called with loaded observatory.
	 * @param options.error {Function}
	 *        called when errors loading observatory.
	 */
	ObservatoryFactory.prototype.getObservatory = function (options) {
		var _this = this;

		if (options.id === null) {
			options.success(new Observatory());
			return;
		}

		Xhr.ajax({
			url: this._options.observatoryDetailUrl,
			data: {
				id: options.id
			},
			success: function (observatory) {
				observatory.instruments = _this._getInstruments(observatory.instruments);
				observatory.piers = _this._getPiers(observatory.piers);
				observatory.observations = _this._getObservations(observatory.observations);
				options.success(new Observatory(observatory));
			},
			error: options.error || function () {}
		});
	};

	/**
	 * Get an observation detail.
	 *
	 * @param options {Object}
	 *        method options.
	 * @param options.id {Integer|null}
	 *        when null, a new ObservationDetail is created.
	 *        otherwise, load Observation with specified id.
	 * @param options.success {Function(ObservationDetail)}
	 *        called with loaded observation.
	 * @param options.error {Function}
	 *        called when errors loading observation.
	 */
	ObservatoryFactory.prototype.getObservation = function (options) {
		var _this = this;

		if (options.id === null) {
			options.success(new ObservationDetail(this));
			return;
		}

		Xhr.ajax({
			url: this._options.observationDetailUrl,
			data: {
				id: options.id
			},
			success: function (observation) {
				observation.readings = _this._getReadings(observation.readings);
				options.success(new ObservationDetail(_this, observation));
			},
			error: options.error || function () {}
		});
	};


	/////////////////////////////////////////////////////////////////////////////
	// Utility Parsing Methods


	/**
	 * Parse an array of instruments.
	 *
	 * @param instruments {Array<Object>}
	 *        array of instruments.
	 * @return {Collection<Instrument>} collection of instrument objects.
	 */
	ObservatoryFactory.prototype._getInstruments = function (instruments) {
		var i,
		    len;
		for (i = 0, len = instruments.length; i < len; i++) {
			instruments[i] = new Instrument(instruments[i]);
		}
		return new Collection(instruments);
	};

	/**
	 * Parse an array of piers.
	 *
	 * @param piers {Array<Object>}
	 *        array of piers.
	 * @return {Collection<Pier>} collection of pier objects.
	 */
	ObservatoryFactory.prototype._getPiers = function (piers) {
		var pier,
		    i,
		    len;
		for (i = 0, len = piers.length; i < len; i++) {
			pier = piers[i];
			pier.marks = this._getMarks(pier.marks);
			piers[i] = new Pier(pier);
		}
		return new Collection(piers);
	};

	/**
	 * Parse an array of marks.
	 *
	 * @param marks {Array<Object>}
	 *        array of marks.
	 * @return {Collection<Mark>} collection of mark objects.
	 */
	ObservatoryFactory.prototype._getMarks = function (marks) {
		var i,
		    len;
		for (i = 0, len = marks.length; i < len; i++) {
			marks[i] = new Mark(marks[i]);
		}
		return new Collection(marks);
	};

	/**
	 * Parse an array of observation summaries.
	 *
	 * @param observations {Array<Object>}
	 *        array of observation summaries.
	 * @return {Collection<ObservationSummary>} collection of observation objects.
	 */
	ObservatoryFactory.prototype._getObservations = function (observations) {
		var i,
		    len;
		for (i = 0, len = observations.length; i < len; i++) {
			observations[i] = new ObservationSummary(this, observations[i]);
		}
		return new Collection(observations);
	};

	/**
	 * Parse an array of readings.
	 *
	 * @param readings {Array<Object>}
	 *        array of readings.
	 * @return {Collection<Reading>} collection of reading objects.
	 */
	ObservatoryFactory.prototype._getReadings = function (readings) {
		var reading,
		    i,
		    len;
		for (i = 0, len = readings.length; i < len; i++) {
			reading = readings[i];
			reading.measurements = this._getMeasurements(reading.measurements);
			readings[i] = new Reading(reading);
		}
		return new Collection(readings);
	};

	/**
	 * Parse an array of measurements.
	 *
	 * @param measurement {Array<Object>}
	 *        array of measurements.
	 * @return {Collection<Measurement>} collection of measurement objects.
	 */
	ObservatoryFactory.prototype._getMeasurements = function (measurements) {
		var i,
		    len;
		for (i = 0, len = measurements.length; i < len; i++) {
			measurements[i] = new Measurement(measurements[i]);
		}
		return new Collection(measurements);
	};


	/////////////////////////////////////////////////////////////////////////////
	// Private Classes


	/**
	 * Inner class used for observatory summary objects by getObservatories().
	 *
	 * Adds getObservatory() method that uses factory to load observatory detail.
	 *
	 * @param factory {ObservatoryFactory}
	 *        the factory that can retrieve the observatory detail.
	 * @param attributes {Object}
	 *        Observatory summary attributes.
	 */
	var ObservatorySummary = function (factory, attributes) {
		this._factory = factory;
		Observatory.call(this, attributes);
	};

	// ObservatorySummary is an Observatory
	ObservatorySummary.prototype = Object.create(Observatory.prototype);

	/**
	 * Get the observatory detail.
	 *
	 * @param options {Object}
	 *        options for getObservatory method.
	 *        id is filled in automatically based on Observatory ID.
	 * @param options.success {Function(observatory)}
	 *        called with loaded observatory.
	 * @param options.error {Function()}
	 *        called when error loading observatory.
	 */
	ObservatorySummary.prototype.getObservatory = function (options) {
		options.id = this.id;
		this._factory.getObservatory(options);
	};


	/**
	 * Inner class used for observation summary objects by getObservatory().
	 *
	 * Adds getObservation() method that uses factory to load observation detail.
	 *
	 * @param factory {ObservatoryFactory}
	 *        the factory that can retrieve the observation detail.
	 * @param attributes {Object}
	 *        Observation summary attributes.
	 */
	var ObservationSummary = function (factory, attributes) {
		this._factory = factory;
		Observation.call(this, attributes);
	};

	// ObservationSummary is an Observation
	ObservationSummary.prototype = Object.create(Observation.prototype);

	/**
	 * Get the observation detail.
	 *
	 * @param options {Object}
	 *        options for getObservation method.
	 *        id is filled in automatically based on Observation ID.
	 * @param options.success {Function(observation)}
	 *        called with loaded observation.
	 * @param options.error {Function()}
	 *        called when error loading observation.
	 */
	ObservationSummary.prototype.getObservation = function (options) {
		options.id = this.id;
		this._factory.getObservation(options);
	};


	/**
	 * Inner class used for observation detail objects by getObservation().
	 *
	 * Adds getObservatory() method that uses factory to load observatory detail.
	 *
	 * @param factory {ObservatoryFactory}
	 *        the factory that can retrieve the observation detail.
	 * @param attributes {Object}
	 *        Observation detail attributes.
	 */
	var ObservationDetail = function (factory, attributes) {
		this._factory = factory;
		this._observatories = null;
		this._observatory = null;
		Observation.call(this, attributes);
	};

	// ObservationDetail is an Observation
	ObservationDetail.prototype = Object.create(Observation.prototype);

	/**
	 * Get the observatory detail.
	 *
	 * @param options {Object}
	 *        options for getObservatory method.
	 *        id is filled in automatically based on Observatory ID.
	 * @param options.success {Function(observatory)}
	 *        called with loaded observatory.
	 * @param options.error {Function()}
	 *        called when error loading observatory.
	 */
	ObservationDetail.prototype.getObservatory = function (options) {
		this._factory.getObservatory(Util.extend({}, options,
				{id: this.get('observatory_id')}));
	};

	/**
	 * Get all observatories.
	 *
	 * @param options {Object}
	 *        options for the getObservatories method.
	 * @return {[type]}         [description]
	 */
	ObservationDetail.prototype.getObservatories = function (options) {
		this._factory.getObservatories(options);
	};


	// return constructor
	return ObservatoryFactory;
});
