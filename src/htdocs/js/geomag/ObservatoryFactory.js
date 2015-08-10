/* global MOUNT_PATH */
'use strict';

var Collection = require('mvc/Collection'),
    Instrument = require('geomag/Instrument'),
    Mark = require('geomag/Mark'),
    Measurement = require('geomag/Measurement'),
    Observation = require('geomag/Observation'),
    Observatory = require('geomag/Observatory'),
    Pier = require('geomag/Pier'),
    Reading = require('geomag/Reading'),
    Util = require('util/Util'),
    Xhr = require('util/Xhr');


// default mount path
var mountPath = (typeof MOUNT_PATH === 'undefined' ? '.' : MOUNT_PATH);

// default options.
var _DEFAULTS = {
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
  var _this,
      _initialize,

      _factory;

  _this = Observatory(attributes);

  _initialize = function (factory) {
    _factory = factory;
  };

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
  _this.getObservatory = function (options) {
    options.id = this.id;
    _factory.getObservatory(options);
  };

  _initialize(factory);
  factory = null;
  attributes = null;
  return _this;
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
  var _this,
      _initialize,

      _factory;

  _this = Observation(attributes);

  _initialize = function (factory) {
    _factory = factory;
  };

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
  _this.getObservation = function (options) {
    options.id = this.id;
    _factory.getObservation(options);
  };

  _initialize(factory);
  factory = null;
  attributes = null;
  return _this;
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
  var _this,
      _initialize,

      _factory,
      _observatories,
      _observatory;

  _this = Observation(attributes);

  _initialize = function (factory) {
    _factory = factory;
    _observatories = null;
    _observatory = null;
  };

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
  _this.getObservatory = function (options) {
    _factory.getObservatory(Util.extend({}, options,
        {id: _this.get('observatory_id')}));
  };

  /**
   * Get all observatories.
   *
   * @param options {Object}
   *        options for the getObservatories method.
   * @return {[type]}         [description]
   */
  _this.getObservatories = function (options) {
    _factory.getObservatories(options);
  };

  _initialize(factory);
  factory = null;
  attributes = null;
  return _this;
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
  var _this,
      _initialize,

      _calculator,
      _observationDetailUrl,
      _observationPublishUrl,
      _observatoryDetailUrl,
      _observatorySummaryUrl,

      _getInstruments,
      _getMarks,
      _getMeasurements,
      _getObservatories,
      _getObservation,
      _getObservations,
      _getObservatory,
      _getPiers,
      _getReadings,
      _serializeObservation,
      _toMilliseconds,
      _toSeconds;

  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _calculator = options.calculator;

    _observationDetailUrl = options.observationDetailUrl;
    _observationPublishUrl = options.observationPublishUrl;
    _observatoryDetailUrl = options.observatoryDetailUrl;
    _observatorySummaryUrl = options.observatorySummaryUrl;
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
  _this.getObservatories = function(options) {
    Xhr.ajax({
      url: _observatorySummaryUrl,
      success: function (data) {
        options.success(_getObservatories(data));
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
  _this.getObservatory = function (options) {
    if (options.id === null) {
      options.success(Observatory());
      return;
    }

    Xhr.ajax({
      url: _observatoryDetailUrl,
      data: {
        id: options.id
      },
      success: function (data) {
        options.success(_getObservatory(data));
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
  _this.getObservation = function (options) {
    if (options.id === null) {
      options.success(_this.newObservation());
      return;
    }

    Xhr.ajax({
      url: _observationDetailUrl,
      data: {
        id: options.id
      },
      success: function (data) {
        options.success(_getObservation(data));
      },
      error: options.error || function () {}
    });
  };

  /**
   * Synchronous factory method for new observation.
   *
   * @return {Observation}
   */
  _this.newObservation = function () {
    return ObservationDetail(_this);
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
  _serializeObservation = function (observation) {
    var data,
        json,
        m,
        measurement,
        measurements,
        mlen,
        r,
        reading,
        readings,
        rlen;

    // serialize the observation to JSON
    json = observation.toJSON();
    // convert milliseconds to seconds
    json.begin = _toSeconds(json.begin);
    json.end = _toSeconds(json.end);
    readings = json.readings;
    for (r = 0, rlen = readings.length; r < rlen; r++) {
      reading = readings[r];
      reading.startD = _toSeconds(reading.startD);
      reading.endD = _toSeconds(reading.endD);
      reading.startH = _toSeconds(reading.startH);
      reading.endH = _toSeconds(reading.endH);
      reading.startZ = _toSeconds(reading.startZ);
      reading.endZ = _toSeconds(reading.endZ);
      measurements = reading.measurements;
      for (m = 0, mlen = measurements.length; m < mlen; m++) {
        measurement = measurements[m];
        measurement.time = _toSeconds(measurement.time);
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
  _this.saveObservation = function (options) {
    var data,
        observation;

    observation = options.observation;
    data = _serializeObservation(observation);

    // post/put observation data to observation_data.php
    Xhr.ajax({
      url: _observationDetailUrl,
      rawdata: data,
      method: (observation.id) ? 'PUT' : 'POST',
      success: function (data) {
        options.success(_getObservation(data));
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
  _this.publishObservation = function (options) {
    var observationId = options.observation.get('id');

    // post observation id to observation_data.php
    Xhr.ajax({
      url: _observationPublishUrl,
      data: {
        id: observationId
      },
      method: 'POST',
      success: function (data) {
        options.success(_getObservation(data));
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
  _this.setCalibrationD = function (reading, calculator) {
    var absolute,
        baseline,
        endtime,
        measurements,
        starttime,
        time,
        valid;

    _calculator = calculator;
    measurements = _this.getDeclinationMeasurements(reading);

    time = _this.getMeasurementValues(measurements, 'time');
    starttime = Math.min(Number.parseInt(time));
    endtime = Math.max(Number.parseInt(time));
    valid = reading.get('declination_valid');
    absolute = _calculator.magneticDeclination(reading);
    baseline = _calculator.dBaseline(reading);

    reading.set({
      startD: starttime,
      endD: endtime,
      absD: absolute,
      baseD: baseline
    });
  };

  /**
   * Summarize the horizontal intensity measurements and serialize onto
   * the reading object
   *
   * @param reading {object}
   */
  _this.setCalibrationH = function (reading, calculator) {
    var absolute,
        baseline,
        endtime,
        measurements,
        starttime,
        time,
        valid;

    _calculator = calculator;
    measurements = _this.getHorizontalIntensityMeasurements(reading);

    time = _this.getMeasurementValues(measurements, 'time');
    starttime = Math.min(Number.parseInt(time));
    endtime = Math.max(Number.parseInt(time));
    valid = reading.get('horizontal_intensity_valid');
    absolute = _calculator.horizontalComponent(reading);
    baseline = _calculator.hBaseline(reading);

    reading.set({
      startH: starttime,
      endH: endtime,
      absH: absolute,
      baseH: baseline
    });
  };

  /**
   * Summarize the vertical intensity measurements and serialize onto
   * the reading object
   *
   * @param reading {object}
   */
  _this.setCalibrationZ = function (reading, calculator) {
    var absolute,
        baseline,
        endtime,
        measurements,
        starttime,
        time,
        valid;

    _calculator = calculator;
    measurements = _this.getVerticalIntensityMeasurements(reading);

    time = _this.getMeasurementValues(measurements, 'time');
    starttime = Math.min(Number.parseInt(time));
    endtime = Math.max(Number.parseInt(time));
    valid = reading.get('vertical_intensity_valid');
    absolute = _calculator.verticalComponent(reading);
    baseline = _calculator.zBaseline(reading);

    reading.set({
      startZ: starttime,
      endZ: endtime,
      absZ: absolute,
      baseZ: baseline
    });
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
  _this.getVerticalIntensityMeasurements = function (reading) {
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
  _this.getHorizontalIntensityMeasurements = function (reading) {
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
  _this.getDeclinationMeasurements = function (reading) {
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
  _this.getMeasurementValues = function (measurements, name) {
    var i = null,
        len = null,
        value,
        values = [];

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
  _getObservatories = function (observatories) {
    var data = [],
        i,
        len;

    for (i = 0, len = observatories.length; i < len; i++) {
      data[i] = ObservatorySummary(_this, observatories[i]);
    }
    return data;
  };

  /**
   * Parse an object into an Observatory.
   *
   * @param observatory {Object}
   * @return {Observatory}
   */
  _getObservatory = function (observatory) {
    var data = Util.extend({}, observatory);

    data.instruments = _getInstruments(observatory.instruments);
    data.piers = _getPiers(observatory.piers);
    data.observations = _getObservations(observatory.observations);
    _selectById(data.piers, data.default_pier_id);

    return Observatory(data);
  };

  /**
   * Parse an object into an Observation.
   *
   * @param observation {Object}
   * @return {Observation}
   */
  _getObservation = function (observation) {
    var data = Util.extend({}, observation);

    data.begin = _toMilliseconds(data.begin);
    data.end = _toMilliseconds(data.end);
    data.readings = _getReadings(observation.readings);

    return ObservationDetail(_this, data);
  };

  /**
   * Parse an array of instruments.
   *
   * @param instruments {Array<Object>}
   *        array of instruments.
   * @return {Collection<Instrument>} collection of instrument objects.
   */
  _getInstruments = function (instruments) {
    var data = [],
        i,
        instrument,
        len;

    for (i = 0, len = instruments.length; i < len; i++) {
      instrument = Util.extend({}, instruments[i]);
      instrument.begin = _toMilliseconds(instrument.begin);
      instrument.end = _toMilliseconds(instrument.end);
      data[i] = Instrument(instrument);
    }

    return Collection(data);
  };

  /**
   * Parse an array of piers.
   *
   * @param piers {Array<Object>}
   *        array of piers.
   * @return {Collection<Pier>} collection of pier objects.
   */
  _getPiers = function (piers) {
    var data = [],
        i,
        len,
        pier;

    for (i = 0, len = piers.length; i < len; i++) {
      pier = Util.extend({}, piers[i]);
      pier.begin = _toMilliseconds(pier.begin);
      pier.end = _toMilliseconds(pier.end);
      pier.marks = _getMarks(pier.marks);
      _selectById(pier.marks, pier.default_mark_id);
      data[i] = Pier(pier);
    }

    return Collection(data);
  };

  /**
   * Parse an array of marks.
   *
   * @param marks {Array<Object>}
   *        array of marks.
   * @return {Collection<Mark>} collection of mark objects.
   */
  _getMarks = function (marks) {
    var data = [],
        i,
        len,
        mark;

    for (i = 0, len = marks.length; i < len; i++) {
      mark = Util.extend({}, marks[i]);
      mark.begin = _toMilliseconds(mark.begin);
      mark.end = _toMilliseconds(mark.end);
      data[i] = Mark(marks[i]);
    }

    return Collection(data);
  };

  /**
   * Parse an array of observation summaries.
   *
   * @param observations {Array<Object>}
   *        array of observation summaries.
   * @return {Collection<ObservationSummary>} collection of observation objects.
   */
  _getObservations = function (observations) {
    var data = [],
        i,
        len,
        observation;

    for (i = 0, len = observations.length; i < len; i++) {
      observation = Util.extend({}, observations[i]);
      observation.begin = _toMilliseconds(observation.begin);
      observation.end = _toMilliseconds(observation.end);
      data[i] = ObservationSummary(_this, observation);
    }
    return Collection(data);
  };

  /**
   * Parse an array of readings.
   *
   * @param readings {Array<Object>}
   *        array of readings.
   * @return {Collection<Reading>} collection of reading objects.
   */
  _getReadings = function (readings) {
    var data = [],
        i,
        len,
        reading;

    for (i = 0, len = readings.length; i < len; i++) {
      reading = Util.extend({}, readings[i]);
      reading.startD = _toMilliseconds(reading.startD);
      reading.endD = _toMilliseconds(reading.endD);
      reading.startH = _toMilliseconds(reading.startH);
      reading.endH = _toMilliseconds(reading.endH);
      reading.startZ = _toMilliseconds(reading.startZ);
      reading.endZ = _toMilliseconds(reading.endZ);
      reading.measurements = _getMeasurements(reading.measurements);
      data[i] = Reading(reading);
    }

    return Collection(data);
  };

  /**
   * Parse an array of measurements.
   *
   * @param measurement {Array<Object>}
   *        array of measurements.
   * @return {Collection<Measurement>} collection of measurement objects.
   */
  _getMeasurements = function (measurements) {
    var data = [],
        i,
        len,
        measurement;

    for (i = 0, len = measurements.length; i < len; i++) {
      measurement = Util.extend({}, measurements[i]);
      measurement.time = _toMilliseconds(measurement.time);
      data[i] = Measurement(measurement);
    }

    return Collection(data);
  };


  /**
   * Convert a seconds value to milliseconds.
   *
   * @param seconds {Number}
   *        second epoch timestamp to convert.
   * @return milliseconds, or null if seconds was null.
   */
  _toMilliseconds = function (seconds) {
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
  _toSeconds = function (milliseconds) {
    if (milliseconds === null) {
      return null;
    }
    return Math.round(milliseconds / 1000);
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = ObservatoryFactory;
