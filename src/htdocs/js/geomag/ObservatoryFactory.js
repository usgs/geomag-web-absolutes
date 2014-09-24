/* global define, MOUNT_PATH */
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
	'geomag/Measurement',
	'geomag/ObservationBaselineCalculator'
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
	Measurement,
	Calculator
) {
	'use strict';


	// default mount path
	var mountPath = (typeof MOUNT_PATH === 'undefined' ? '.' : MOUNT_PATH);

	// default options.
	var DEFAULTS = {
		observatorySummaryUrl: mountPath + '/observatory_summary_feed.php',
		observatoryDetailUrl: mountPath + '/observatory_detail_feed.php',
		observationDetailUrl: mountPath + '/observation_data.php',
		observationPublishUrl: mountPath + '/publish.php'
	};


	/**
	 * Utility function to select a collection item based on item id.
	 *
	 * If collection is not null, selects collection item with id
	 * or triggers deselect if no matching item found.
	 *
	 * @param collection {Collection}
	 *        collection being selected.
	 * @param id {Number}
	 *        id of collection item to select.
	 */
	var _selectById = function (collection, id) {
		var item = null;
		if (collection !== null) {
			if (id !== null) {
				item = collection.get(id);
			}
			if (item !== null) {
				collection.select(item);
			} else {
				collection.deselect();
			}
		}
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
	 *        url for observatory detail feed, should expect id as a GET
	 *        parameter.
	 *        default 'observatory_detail_feed.php'.
	 * @param options.observationDetailUrl {String}
	 *        url for observation detail feed, should expect id as a GET
	 *        parameter.
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
				options.success(_this._getObservatories(data));
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
			success: function (data) {
				options.success(_this._getObservatory(data));
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
			options.success(this.newObservation());
			return;
		}

		Xhr.ajax({
			url: this._options.observationDetailUrl,
			data: {
				id: options.id
			},
			success: function (data) {
				options.success(_this._getObservation(data));
			},
			error: options.error || function () {}
		});
	};

	/**
	 * Synchronous factory method for new observation.
	 *
	 * @return {Observation}
	 */
	ObservatoryFactory.prototype.newObservation = function () {
		return new ObservationDetail(this);
	};


	/**
	 * Serializes an observation to a string.
	 *
	 * Converts millisecond timestamps to second timestamps for server.
	 *
	 * @param observation {Observation}
	 *        observation to serialize.
	 * @return {String} serialized observation.
	 */
	ObservatoryFactory.prototype._serializeObservation = function (observation) {
		var json,
		    readings,
		    reading,
		    r,
		    rlen,
		    measurements,
		    measurement,
		    m,
		    mlen,
		    data;

		// serialize the observation to JSON
		json = observation.toJSON();
		// convert milliseconds to seconds
		json.begin = this._toSeconds(json.begin);
		json.end = this._toSeconds(json.end);
		readings = json.readings;
		for (r = 0, rlen = readings.length; r < rlen; r++) {
			reading = readings[r];
			measurements = reading.measurements;
			for (m = 0, mlen = measurements.length; m < mlen; m++) {
				measurement = measurements[m];
				measurement.time = this._toSeconds(measurement.time);
			}
		}
		// convert JSON to string
		data = JSON.stringify(json);
		return data;
	};


	/**
	 * Save an observation to the server.
	 *
	 * @param options {Object}
	 *        method options.
	 * @param options.observation {Observation}
	 *        the observation to save.
	 * @param options.success {Function(ObservationDetail)}
	 *        called with saved observatory as returned by server.
	 * @param options.error {Function}
	 *        called when errors loading observatories.
	 */
	ObservatoryFactory.prototype.saveObservation = function (options) {
		var _this = this,
		    observationDetailUrl = this._options.observationDetailUrl,
		    observation = options.observation,
		    data = this._serializeObservation(observation);

		// post/put observation data to observation_data.php
		Xhr.ajax({
			url: observationDetailUrl,
			rawdata: data,
			method: (observation.id) ? 'PUT' : 'POST',
			success: function (data) {
				options.success(_this._getObservation(data));
			},
			error: options.error || function () {}
		});
	};

	/**
	 * Save an observation to the MagProc2 server
	 *
	 * @param options {Object}
	 *        method options.
	 * @param options.observation.get('id') {Integer}
	 *        the observation id of the observation to save.
	 * @param options.success {Function(ObservationDetail)}
	 *        called with saved observatory id.
	 * @param options.error {Function}
	 *        called when errors saving observatories.
	 */
	ObservatoryFactory.prototype.publishObservation = function (options) {
		var _this = this,
		    observationPublishUrl = this._options.observationPublishUrl,
		    observationId = options.observation.get('id');

		// post observation id to observation_data.php
		Xhr.ajax({
			url: observationPublishUrl,
			data: {
				id: observationId
			},
			method: 'POST',
			success: function (data) {
				options.success(_this._getObservation(data));
			},
			error: options.error || function () {}
		});
	};

	/**
	 * Summarize the declination measurements and serialize onto the
	 * reading object
	 *
	 * @param reading {object}
	 */
	ObservatoryFactory.prototype.setCalibrationD = function (reading) {
		var measurements = this.getDeclinationMeasurements(reading),
		    starttime, endtime, absolute, baseline, valid, time,
		    calculator = new Calculator();

		time = this.getMeasurementValues(measurements, 'time');
		starttime = Math.min(Number.parseInt(time));
		endtime = Math.max(Number.parseInt(time));
		valid = reading.get('declination_valid');
		absolute = calculator.magneticDeclination(reading);
		baseline = calculator.dBaseline(reading);

		reading.startD = starttime;
		reading.endD = endtime;
		reading.absD = absolute;
		reading.baseD = baseline;
	};

	/**
	 * Summarize the horizontal intensity measurements and serialize onto
	 * the reading object
	 *
	 * @param reading {object}
	 */
	ObservatoryFactory.prototype.setCalibrationH = function (reading) {
		var measurements = this.getHorizontalIntensityMeasurements(reading),
		    starttime, endtime, absolute, baseline, valid, time,
		    calculator = new Calculator();

		time = this.getMeasurementValues(measurements, 'time');
		starttime = Math.min(Number.parseInt(time));
		endtime = Math.max(Number.parseInt(time));
		valid = reading.get('horizontal_intensity_valid');
		absolute = calculator.horizontalComponent(reading);
		baseline = calculator.hBaseline(reading);

		reading.startH = starttime;
		reading.endH = endtime;
		reading.absH = absolute;
		reading.baseH = baseline;
	};

	/**
	 * Summarize the vertical intensity measurements and serialize onto
	 * the reading object
	 *
	 * @param reading {object}
	 */
	ObservatoryFactory.prototype.setCalibrationZ = function (reading) {
		var measurements = this.getVerticalIntensityMeasurements(reading),
		    starttime, endtime, absolute, baseline, valid, time,
		    calculator = new Calculator();

		time = this.getMeasurementValues(measurements, 'time');
		starttime = Math.min(Number.parseInt(time));
		endtime = Math.max(Number.parseInt(time));
		valid = reading.get('vertical_intensity_valid');
		absolute = calculator.verticalComponent(reading);
		baseline = calculator.zBaseline(reading);

		reading.startZ = starttime;
		reading.endZ = endtime;
		reading.absZ = absolute;
		reading.baseZ = baseline;
	};



	/////////////////////////////////////////////////////////////////////////////
	// Utility Parsing Methods

	/**
	 * Return the values that make up a vertical intensity measurement from
	 * a single reading.
	 *
	 * @param  reading {object}
	 * @return {Array<Object>} an array of measurements
	 */
	ObservatoryFactory.prototype.getVerticalIntensityMeasurements =
			function (reading) {
		var allMeasurements = reading.getMeasurements(),
		    measurements = [];

		measurements.push(allMeasurements[Measurement.SOUTH_DOWN][0]);
		measurements.push(allMeasurements[Measurement.NORTH_UP][0]);
		measurements.push(allMeasurements[Measurement.SOUTH_UP][0]);
		measurements.push(allMeasurements[Measurement.NORTH_DOWN][0]);

		return measurements;
	};

	/**
	 * Return the values that make up a horizontal intensity measurement from
	 * a single reading.
	 *
	 * @param  reading {object}
	 * @return {Array<Object>} an array of measurements
	 */
	ObservatoryFactory.prototype.getHorizontalIntensityMeasurements =
			function (reading) {
		var allMeasurements = reading.getMeasurements(),
		    measurements = [];

		measurements.push(allMeasurements[Measurement.SOUTH_DOWN][0]);
		measurements.push(allMeasurements[Measurement.NORTH_UP][0]);
		measurements.push(allMeasurements[Measurement.SOUTH_UP][0]);
		measurements.push(allMeasurements[Measurement.NORTH_DOWN][0]);

		return measurements;
	};

	/**
	 * Return the values that make up a declination measurement from
	 * a single reading.
	 *
	 * @param  reading {object}
	 * @return {Array<Object>} an array of measurements
	 */
	ObservatoryFactory.prototype.getDeclinationMeasurements = function (reading) {
		var allMeasurements = reading.getMeasurements(),
		    measurements = [];

		measurements.push(allMeasurements[Measurement.WEST_DOWN][0]);
		measurements.push(allMeasurements[Measurement.EAST_DOWN][0]);
		measurements.push(allMeasurements[Measurement.WEST_UP][0]);
		measurements.push(allMeasurements[Measurement.EAST_UP][0]);

		measurements.push(allMeasurements[Measurement.FIRST_MARK_UP][0]);
		measurements.push(allMeasurements[Measurement.FIRST_MARK_DOWN][0]);
		measurements.push(allMeasurements[Measurement.SECOND_MARK_UP][0]);
		measurements.push(allMeasurements[Measurement.SECOND_MARK_DOWN][0]);

		return measurements;
	};

	/**
	 * Parse an array of measurement values into an array of scalar values
	 * that match the key "name"
	 *
	 * @param  {object} measurements, a collection of measurements
	 * @param  {string} name, the measurement model value to be returned
	 *
	 * @return {array} an array of values that match the key "name"
	 */
	ObservatoryFactory.prototype.getMeasurementValues = function (measurements, name) {
		var i = null,
		    len = null,
		    values = [],
		    value;

		for (i = 0, len = measurements.length; i < len; i++) {
			value = measurements[i].get(name);
			if (value !== null) {
				values.push(measurements[i].get(name));
			}
		}
		return values;
	};

	/**
	 * Parse an array of observatories into objects.
	 *
	 * @param observatories {Array<Object>}.
	 * @return {Collection<Observatory>}.
	 */
	ObservatoryFactory.prototype._getObservatories = function (observatories) {
		var i, len, data = [];
		for (i = 0, len = observatories.length; i < len; i++) {
			data[i] = new ObservatorySummary(this, observatories[i]);
		}
		return data;
	};

	/**
	 * Parse an object into an Observatory.
	 *
	 * @param observatory {Object}
	 * @return {Observatory}
	 */
	ObservatoryFactory.prototype._getObservatory = function (observatory) {
		var data = Util.extend({}, observatory);
		data.instruments = this._getInstruments(observatory.instruments);
		data.piers = this._getPiers(observatory.piers);
		data.observations = this._getObservations(observatory.observations);
		_selectById(data.piers, data.default_pier_id);
		return new Observatory(data);
	};

	/**
	 * Parse an object into an Observation.
	 *
	 * @param observation {Object}
	 * @return {Observation}
	 */
	ObservatoryFactory.prototype._getObservation = function (observation) {
		var data = Util.extend({}, observation);
		data.begin = this._toMilliseconds(data.begin);
		data.end = this._toMilliseconds(data.end);
		data.readings = this._getReadings(observation.readings);
		return new ObservationDetail(this, data);
	};

	/**
	 * Parse an array of instruments.
	 *
	 * @param instruments {Array<Object>}
	 *        array of instruments.
	 * @return {Collection<Instrument>} collection of instrument objects.
	 */
	ObservatoryFactory.prototype._getInstruments = function (instruments) {
		var i,
		    len,
		    data = [],
		    instrument;
		for (i = 0, len = instruments.length; i < len; i++) {
			instrument = Util.extend({}, instruments[i]);
			instrument.begin = this._toMilliseconds(instrument.begin);
			instrument.end = this._toMilliseconds(instrument.end);
			data[i] = new Instrument(instrument);
		}
		return new Collection(data);
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
		    len,
		    data = [];
		for (i = 0, len = piers.length; i < len; i++) {
			pier = Util.extend({}, piers[i]);
			pier.begin = this._toMilliseconds(pier.begin);
			pier.end = this._toMilliseconds(pier.end);
			pier.marks = this._getMarks(pier.marks);
			_selectById(pier.marks, pier.default_mark_id);
			data[i] = new Pier(pier);
		}
		return new Collection(data);
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
		    len,
		    data = [],
		    mark;
		for (i = 0, len = marks.length; i < len; i++) {
			mark = Util.extend({}, marks[i]);
			mark.begin = this._toMilliseconds(mark.begin);
			mark.end = this._toMilliseconds(mark.end);
			data[i] = new Mark(marks[i]);
		}
		return new Collection(data);
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
		    len,
		    data = [],
		    observation;
		for (i = 0, len = observations.length; i < len; i++) {
			observation = Util.extend({}, observations[i]);
			observation.begin = this._toMilliseconds(observation.begin);
			observation.end = this._toMilliseconds(observation.end);
			data[i] = new ObservationSummary(this, observation);
		}
		return new Collection(data);
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
		    len,
		    data = [];
		for (i = 0, len = readings.length; i < len; i++) {
			reading = Util.extend({}, readings[i]);
			reading.measurements = this._getMeasurements(reading.measurements);
			data[i] = new Reading(reading);
		}
		return new Collection(data);
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
		    len,
		    data = [],
		    measurement;
		for (i = 0, len = measurements.length; i < len; i++) {
			measurement = Util.extend({}, measurements[i]);
			measurement.time = this._toMilliseconds(measurement.time);
			data[i] = new Measurement(measurement);
		}
		return new Collection(data);
	};


	/**
	 * Convert a seconds value to milliseconds.
	 *
	 * @param seconds {Number}
	 *        second epoch timestamp to convert.
	 * @return milliseconds, or null if seconds was null.
	 */
	ObservatoryFactory.prototype._toMilliseconds = function (seconds) {
		if (seconds === null) {
			return null;
		}
		return seconds * 1000;
	};

	/**
	 * Convert a milliseconds value to seconds.
	 *
	 * @param milliseconds {Number}
	 *        millisecond epoch timestamp to convert.
	 * @return seconds, or null if milliseconds was null.
	 */
	ObservatoryFactory.prototype._toSeconds = function (milliseconds) {
		if (milliseconds === null) {
			return null;
		}
		return Math.round(milliseconds / 1000);
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
