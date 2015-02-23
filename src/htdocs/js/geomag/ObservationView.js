'use strict';

var View = require('mvc/View'),
    Collection = require('mvc/Collection'),
    Util = require('util/Util'),
    ModalView = require('mvc/ModalView'),

    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    ObservationMetaView = require('geomag/ObservationMetaView'),
    ReadingGroupView = require('geomag/ReadingGroupView'),
    ObservationBaselineCalculator = require('geomag/ObservationBaselineCalculator'),
    RealtimeDataFactory = require('geomag/RealtimeDataFactory'),
    User = require('geomag/User');


var _DEFAULTS = {
  observationId: null,
  factory: ObservatoryFactory(),
  baselineCalculator: ObservationBaselineCalculator(),
  realtimeDataFactory: RealtimeDataFactory()
};

/**
 * Callback to show publish success in modal dialog.
 *
 * @param status {Integer}
 *        http error status code.
 * @param xhr {XMLHttpRequest}
 *        XHR object with error information.
 */
var __saveSuccess = function () {
  (ModalView(
    '<h3>Success!</h3><p>Your observation has been saved.</p>',
    {
      title: 'Save Successful',
      classes: ['modal-success'],
      closable: true
    }
  )).show();
};

/**
 * Callback to show publish erros in modal dialog.
 *
 * @param status {Integer}
 *        http error status code.
 * @param xhr {XMLHttpRequest}
 *        XHR object with error information.
 */
var __saveError = function (status, xhr) {
  (ModalView(
    '<h3>Error</h3><p>' + xhr.response + '</p>',
    {
      title: 'Save Failed',
      classes: ['modal-error'],
      closable: true
    }
  )).show();
};

/**
 * Callback to show publish success in modal dialog.
 *
 */
var __publishSuccess = function () {
  (ModalView(
    '<h3>Success!</h3><p>Your observation has been published.</p>',
    {
      title: 'Publish Successful',
      classes: ['modal-success'],
      closable: true
    }
  )).show();
};

/**
 * Callback to show publish errors in modal dialog.
 *
 * @param status {Integer}
 *        http error status code.
 * @param xhr {XMLHttpRequest}
 *        XHR object with error information.
 */
var __publishError = function (status, xhr) {
  (ModalView(
    '<h3>Error</h3><p>' + xhr.response + '</p>',
    {
      title: 'Publish Failed',
      classes: ['modal-error'],
      closable: true
    }
  )).show();
};


var ObservationView = function (options) {
  var _this,
      _initialize,

      _calculator,
      _factory,
      _observation,
      _observatories,
      _observationMetaView,
      _readingGroupView,
      _realtimeDataFactory,
      _user,

      _createControls,
      _formatMeasurementErrors,
      _getRealtimeData,
      _onObservatorySelect,
      _onPublishClick,
      _onSaveClick,
      _publishObservation,
      _removeControls,
      _saveObservation,
      _setObservation,
      _setObservatories,
      _updateErrorCount;


  _this = View(options);

  _initialize = function (options) {
    var el = _this.el;

    options = Util.extend({}, _DEFAULTS, options);

    _calculator = options.baselineCalculator;
    _factory = options.factory;
    _observation = null;
    _observatories = null;
    _observationMetaView = null;
    _readingGroupView = null;
    _realtimeDataFactory = options.realtimeDataFactory;
    _user = User.getCurrentUser();

    el.innerHTML = [
      '<section class="observation-view">',
        '<section class="observation-meta-wrapper"></section>',
        '<section class="reading-group-view-wrapper"></section>',
        '<section class="observation-view-controls"></section>',
      '</section>'
    ].join('');


    // load observation
    _factory.getObservation({
      id: options.observationId || null,
      success: _setObservation
    });
  };


  /**
   * Called when observation has been loaded.
   *
   * @param observation {Observation}
   *        result of ObservatoryFactory.getObservatory().
   */
  _setObservation = function (observation) {
    var el = _this.el;

    _observation = observation;

    // Add save/publish buttons based on roles
    if (_observation.get('reviewed') === 'N') {
      _createControls();
    } else {
      _removeControls();
    }

    // calculate calibrations for summary view
    _this.updateCalibrations();

    // create reading group view
    _readingGroupView = ReadingGroupView({
      el: el.querySelector('.reading-group-view-wrapper'),
      observation: _observation,
      baselineCalculator: _calculator
    });

    // load observatories for meta view
    _observation.getObservatories({
      success: _setObservatories
    });


    // bind realtime data factory and measurements.
    _realtimeDataFactory.on('change:observatory', _getRealtimeData);
    _observation.eachMeasurement(function (measurement) {
      measurement.on('change:time', _getRealtimeData);
    });

    // bind to measurement change
    _observation.eachMeasurement(function (measurement) {
      measurement.on('change', _updateErrorCount);
    });

    // bind calibration update to measurement change
    _observation.eachMeasurement(function (measurement) {
      measurement.on('change', _this.updateCalibrations);
    });
  };


  /**
   * Called when observatories have been loaded.
   *
   * @param observatories {Array<Object>}
   *        result of ObservatoryFactory.getObservatories().
   */
  _setObservatories = function (observatories) {
    var el = _this.el,
        observatory_id,
        observatory,
        i,
        len;

    //filter observatories list for non admin users
    if (_user.get('admin') !== 'Y') {
      observatory_id = _user.get('default_observatory_id');

      if (observatory_id !== null) {
        observatory_id = parseInt(observatory_id, 10);

        for (i = 0, len = observatories.length; i < len; i++) {
          if (observatories[i].id === observatory_id) {
            observatories = [observatories[i]];
            break;
          }
        }
        if (observatories.length !== 1) {
          observatories = [];
        }
      } else {
        observatories = [];
      }
    }

    // convert to collection
    _observatories = Collection(observatories);

    // bind before select code below, so this will run for first select
    _observatories.on('select', _onObservatorySelect, this);

    // select observation observatory if set
    observatory_id = _observation.get('observatory_id');

    if (observatory_id !== null) {
      observatory = _observatories.get(observatory_id);
      if (observatory !== null) {
        _observatories.select(observatory);
      }
    }

    // create observation meta view
    _observationMetaView = ObservationMetaView({
      el: el.querySelector('.observation-meta-wrapper'),
      observation: _observation,
      observatories: _observatories,
      calculator: _calculator,
      observatoryId: parseInt(window.location.hash.replace('#', ''), 10)
    });
  };

  /**
   * Called when an observatory is selected.
   */
  _onObservatorySelect = function () {
    var code = null,
        observatory;
    observatory = _observatories.getSelected();
    if (observatory !== null) {
      code = observatory.get('code');
    }
    _realtimeDataFactory.set({observatory: code});
  };

  /**
   * Get realtime data for all measurements.
   */
  _getRealtimeData = function () {
    var observatory = _realtimeDataFactory.get('observatory'),
        starttime = null,
        endtime = null;

    if (observatory === null) {
      // need more information
      return;
    }

    // find times to request
    _observation.eachMeasurement(function (measurement) {
      var time = measurement.get('time');
      if (time === null) {
        return;
      }
      if (starttime === null || time < starttime) {
        starttime = time;
      }
      if (endtime === null || time > endtime) {
        endtime = time;
      }
    });
    if (starttime === null || endtime === null) {
      // need more information
      return;
    }

    // request realtime data
    starttime = Math.round(starttime / 1000);
    endtime = Math.round(endtime / 1000);

    _realtimeDataFactory.getRealtimeData({
      starttime: starttime,
      endtime: endtime,
      success: function (realtimeData) {
        // update measurement data
        _observation.eachMeasurement(function (measurement) {
          measurement.setRealtimeData(realtimeData);
        });
      }
    });

  };


  /**
   * Create a panel at the bottom of the Observation view to create, update,
   * or delete the observation.
   *
   */
  _createControls = function () {
    var controls = _this.el.querySelector('.observation-view-controls'),
        saveButton = document.createElement('button'),
        publishButton;

    saveButton.id = 'saveButton';
    saveButton.innerHTML = 'Save Observation';

    saveButton.addEventListener('click', _onSaveClick);

    controls.appendChild(saveButton);

    // Add publish button for admin users
    if (_user.get('admin') === 'Y') {
      publishButton = document.createElement('button');
      publishButton.innerHTML = 'Publish';
      controls.appendChild(publishButton);

      publishButton.addEventListener('click', _onPublishClick);
    }
  };

  /**
   * Removes the save and publish buttons after an observation
   * is successfully published.
   */
  _removeControls = function () {
    var controls = _this.el.querySelector('.observation-view-controls');

    controls.innerHTML =
        '<div class="alert success">Observation has been published.</div>';
  };

  /**
   * Save button click handler.
   */
  _onSaveClick = function () {
    _saveObservation(__saveSuccess, __saveError);
  };

  /**
   * Save the current observation.
   *
   * @param callback {Function}
   *        called after save succeeds.
   * @param errback {Function}
   *        called after save fails.
   */
  _saveObservation = function (callback, errback) {
    // update observation reading model with calibrations before saving
    _this.updateCalibrations();

    _factory.saveObservation({
      observation: _observation,
      success: function (observation) {
        _observation.set({id: observation.get('id')}, {silent: true});
        callback();
      },
      error: function (status, xhr) {
        if (typeof errback === 'function') {
          errback(status, xhr);
        } else {
          throw new Error(xhr.response);
        }
      }
    });
  };

  /**
   * Publish button click handler.
   */
  _onPublishClick = function () {
    try {
      _saveObservation(function () {
          _publishObservation(function () {
            __publishSuccess();
          }
        );
      });
    } catch (e) {
      __publishError('Publish Failed', e.message);
    }
  };

  /**
   * Save the observation, on success publish that data to the magproc2 server.
   *
   * @param callback {Function}
   *        called after publish succeeds.
   * @param errback {Function}
   *        called after publish fails.
   */
  _publishObservation = function (callback, errback) {
    _factory.publishObservation({
      observation: _observation,
      user: _user,
      success: function (observation) {
        _observation.set({
          reviewed: observation.get('reviewed'),
          reviewer_user_id: observation.get('reviewer_user_id')
        });
        _removeControls();
        callback();
      },
      error: function (status, xhr) {
        if (typeof errback === 'function') {
          errback(status, xhr);
        } else {
          throw new Error(xhr.response);
        }
      }
    });
  };

  /**
   * Summarize component D,H,Z and store the calibrated values on
   * the reading model object
   */
  _this.updateCalibrations = function () {
    var readings = _observation.get('readings').data(),
        i, len, reading;

    for (i = 0, len = readings.length; i < len; i++) {
      reading = readings[i];

      _factory.setCalibrationD(reading);
      _factory.setCalibrationH(reading);
      _factory.setCalibrationZ(reading);
    }
  };


  _updateErrorCount = function () {
    var errors = [],
        el = _this.el.querySelector('.observation-view-controls'),
        errorDiv,
        measurementErrors,
        saveButton = el.querySelector('#saveButton'),
        readingErrors, setNumber, list, header;


    _observation.eachReading(function (reading) {

      setNumber = reading.get('set_number');
      readingErrors = [];

      reading.eachMeasurement(function (measurement) {

        // get all errors for the measurement
        measurementErrors = _formatMeasurementErrors(measurement);

        // check for number of measurement errors
        if (measurementErrors !== null) {
          // if there are errors add to total number of errors
          readingErrors.push(measurementErrors);
        }

      });

      // organize all errors by reading set
      if (readingErrors.length > 0) {
        errors.push('<li>' +
            'Set ' + setNumber + ' has error(s)' +
              '<ul>' +
                readingErrors.join('') +
              '</ul>' +
          '</li>'
        );
      }
    });

    errorDiv = el.querySelector('.error');

    // errors exist, append details
    if (errors.length > 0) {

      list = el.querySelector('.alert > ul');

      if (list) {
        list.innerHTML = errors.join('');
      } else {
        errorDiv = document.createElement('div');
        errorDiv.className = 'alert error';
        el.appendChild(errorDiv);

        header = document.createElement('header');
        header.innerHTML = 'Errors';
        errorDiv.appendChild(header);

        list = document.createElement('ul');
        list.innerHTML = errors.join('');
        errorDiv.appendChild(list);

        // disable the save button
        if (saveButton) {
          saveButton.setAttribute('disabled', 'disabled');
        }
      }
    } else {
        // enable the save button
        if (saveButton) {
          saveButton.removeAttribute('disabled');
        }

        if (errorDiv) {
          errorDiv.remove();
        }
    }
  };


  _formatMeasurementErrors = function (measurement) {
    var time_error = measurement.get('time_error'),
        angle_error = measurement.get('angle_error'),
        markup = [];

    if (time_error !== null) {
      markup.push(measurement.get('type') + ' - ' + time_error);
    }

    if (angle_error !== null) {
      markup.push(measurement.get('type') + ' - ' + angle_error);
    }

    if (markup.length === 0) {
      return null;
    }

    return '<li>' + markup.join('</li><li>') + '</li>';
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = ObservationView;
