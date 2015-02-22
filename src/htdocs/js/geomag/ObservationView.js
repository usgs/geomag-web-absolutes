'use strict';

var Collection = require('mvc/Collection'),
    ObservationBaselineCalculator = require('geomag/ObservationBaselineCalculator'),
    ObservationMetaView = require('geomag/ObservationMetaView'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    ModalView = require('mvc/ModalView'),
    ReadingGroupView = require('geomag/ReadingGroupView'),
    RealtimeDataFactory = require('geomag/RealtimeDataFactory'),
    User = require('geomag/User'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  observationId: null,
  factory: ObservatoryFactory(),
  baselineCalculator: ObservationBaselineCalculator(),
  realtimeDataFactory: RealtimeDataFactory()
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
 * Construct a new ObservationView.
 *
 * @param options {Object}
 *        view options.
 * @param options.baselineCalculator
 * @param options.factory
 * @param options.realtimeDataFactory
 */
var ObservationView = function (options) {
  var _this,
      _initialize,

      _options,

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

  _options = Util.extend({}, _DEFAULTS, options);
  _this = View(_options);
  /**
   * Initialize the observation view.
   * @param options {Object} same as constructor.
   */
  _initialize = function () {
    var el = _this.el,
        factory,
        calculator,
        realtimeDataFactory;

    factory = _options.factory;
    calculator = _options.baselineCalculator;
    realtimeDataFactory = _options.realtimeDataFactory;

    el.innerHTML = [
      '<section class="observation-view">',
        '<section class="observation-meta-wrapper"></section>',
        '<section class="reading-group-view-wrapper"></section>',
        '<section class="observation-view-controls"></section>',
      '</section>'
    ].join('');

    _this._calculator = calculator;
    _this._realtimeDataFactory = realtimeDataFactory;
    _this._observation = null;
    _this._observatories = null;
    _this._observationMetaView = null;
    _this._readingGroupView = null;
    // _this._user = User.getCurrentUser();
    _this._user = User;
    _this._user = _this._user.getCurrentUser();

    // load observation
    factory.getObservation({
      id: _options.observationId || null,
      success: _setObservation.bind(_this)
    });
  };

  /**
   * Create a panel at the bottom of the Observation view to create, update,
   * or delete the observation.
   *
   */
  _createControls = function () {
    var controls = _this.el.querySelector('.observation-view-controls'),
        user = _this._user,
        saveButton = document.createElement('button'),
        publishButton;

    saveButton.id = 'saveButton';
    saveButton.innerHTML = 'Save Observation';

    saveButton.addEventListener('click', _onSaveClick);

    controls.appendChild(saveButton);

    // Add publish button for admin users
    if (user.get('admin') === 'Y') {
      publishButton = document.createElement('button');
      publishButton.innerHTML = 'Publish';
      controls.appendChild(publishButton);

      publishButton.addEventListener('click', _onPublishClick);
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

  /**
   * Get realtime data for all measurements.
   */
  _getRealtimeData = function () {
    var realtimeDataFactory = _this._realtimeDataFactory,
        observatory = realtimeDataFactory.get('observatory'),
        observation = _this._observation,
        starttime = null,
        endtime = null;

    if (observatory === null) {
      // need more information
      return;
    }

    // find times to request
    observation.eachMeasurement(function (measurement) {
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
    realtimeDataFactory.getRealtimeData({
      starttime: starttime,
      endtime: endtime,
      success: function (realtimeData) {
        // update measurement data
        observation.eachMeasurement(function (measurement) {
          measurement.setRealtimeData(realtimeData);
        });
      }
    });
  };

  /**
   * Called when an observatory is selected.
   */
  _onObservatorySelect = function () {
    var code = null,
        observatory;
    observatory = _this._observatories.getSelected();
    if (observatory !== null) {
      code = observatory.get('code');
    }
    _this._realtimeDataFactory.set({observatory: code});
  };

  /**
   * Publish button click handler.
   */
  _onPublishClick = function () {
    try {
      _this._saveObservation(function () {
          _publishObservation(function () {
            (ModalView(
              '<p>Your observation has been published.</p>',
              {
                title: 'Publish Successful',
                classes: ['modal-success'],
                closable: true
              }
            )).show();
          }
        );
      });
    } catch (e) {
      _this._showErrorDialog('Publish Failed', e.message);
    }
  };

  /**
   * Save button click handler.
   */
  _onSaveClick = function () {
    _this._saveObservation(__saveSuccess, __saveError);
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
    var factory = _options.factory,
        user = _this._user;

    factory.publishObservation({
      observation: _this._observation,
      user: user,
      success: function (observation) {
        _this._observation.set({
          reviewed: observation.get('reviewed'),
          reviewer_user_id: observation.get('reviewer_user_id')
        });
        _this._removeControls();
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
   * Removes the save and publish buttons after an observation
   * is successfully published.
   */
  _removeControls = function () {
    var controls = _this.el.querySelector('.observation-view-controls');

    controls.innerHTML =
        '<div class="alert success">Observation has been published.</div>';
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
    var factory = _options.factory;

    // update observation reading model with calibrations before saving
    _this.updateCalibrations();

    factory.saveObservation({
      observation: _this._observation,
      success: function (observation) {
        _this._observation.set({id: observation.get('id')}, {silent: true});
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
   * Called when observation has been loaded.
   *
   * @param observation {Observation}
   *        result of ObservatoryFactory.getObservatory().
   */
  _setObservation = function (observation) {
    var el = _this.el,
        calculator = _this._calculator;

    _this._observation = observation;

    // Add save/publish buttons based on roles
    if (_this._observation.get('reviewed') === 'N') {
      _createControls();
    } else {
      _removeControls();
    }
    // calculate calibrations for summary view
    _this.updateCalibrations();
    // create reading group view
    _this._readingGroupView = ReadingGroupView({
      el: el.querySelector('.reading-group-view-wrapper'),
      observation: observation,
      baselineCalculator: calculator
    });

    // load observatories for meta view
    observation.getObservatories({
      success: _setObservatories.bind(_this)
    });


    // bind realtime data factory and measurements.
    _this._realtimeDataFactory.on('change:observatory', _getRealtimeData);
    observation.eachMeasurement(function (measurement) {
      measurement.on('change:time', _getRealtimeData);
    });

    // bind to measurement change
    _this._observation.eachMeasurement(function (measurement) {
      measurement.on('change', _updateErrorCount);
    });

    // bind calibration update to measurement change
    _this._observation.eachMeasurement(function (measurement) {
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
        user = _this._user,
        observation = _this._observation,
        calculator = _this._calculator,
        observatory_id,
        observatory,
        i,
        len;

    //filter observatories list for non admin users
    if (user.get('admin') !== 'Y') {
      observatory_id = user.get('default_observatory_id');
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
    _this._observatories = observatories = Collection(observatories);
    // bind before select code below, so this will run for first select
    observatories.on('select', _onObservatorySelect, _this);
    // select observation observatory if set
    observatory_id = observation.get('observatory_id');
    if (observatory_id !== null) {
      observatory = observatories.get(observatory_id);
      if (observatory !== null) {
        observatories.select(observatory);
      }
    }

    // create observation meta view
    _this._observationMetaView = ObservationMetaView({
      el: el.querySelector('.observation-meta-wrapper'),
      observation: observation,
      observatories: observatories,
      calculator: calculator,
      observatoryId: parseInt(window.location.hash.replace('#', ''), 10)
    });
  };

  _updateErrorCount = function () {
    var errors = [],
        el = _this.el.querySelector('.observation-view-controls'),
        errorDiv,
        measurementErrors,
        saveButton = el.querySelector('#saveButton'),
        readingErrors, setNumber, list, header;

    _this._observation.eachReading(function (reading) {
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

    errorDiv = el.querySelector('.alert');

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
        saveButton.disabled = true;
      }
    } else {
        // enable the save button
        saveButton.disabled = false;
        if(errorDiv) {
          errorDiv.remove();
        }
    }
  };


  /**
   * Summarize component D,H,Z and store the calibrated values on
   * the reading model object
   */
  _this.updateCalibrations = function () {
    var factory = _options.factory,
        readings = _this._observation.get('readings').data(),
        i, len, reading;

    for (i = 0, len = readings.length; i < len; i++) {
      reading = readings[i];

      factory.setCalibrationD(reading);
      factory.setCalibrationH(reading);
      factory.setCalibrationZ(reading);
    }
  };

  _this.render = function () {
    // nothing to render, sub views handle everything
  };

  _initialize();
  options = null;
  return _this;
};

module.exports = ObservationView;
