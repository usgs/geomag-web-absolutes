/* global define */
define([
	'mvc/View',
	'mvc/Collection',
	'util/Util',
	'util/Xhr',
	'mvc/ModalView',

	'geomag/ObservatoryFactory',
	'geomag/Observation',
	'geomag/ObservationMetaView',
	'geomag/ReadingGroupView',
	'geomag/ObservationBaselineCalculator',
	'geomag/RealtimeDataFactory',
	'geomag/User'
], function (
	View,
	Collection,
	Util,
	Xhr,
	ModalView,

	ObservatoryFactory,
	Observation,
	ObservationMetaView,
	ReadingGroupView,
	ObservationBaselineCalculator,
	RealtimeDataFactory,
	User
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
				'<section class="observation-view-controls"></section>',
			'</section>'
		].join('');

		this._calculator = calculator;
		this._realtimeDataFactory = realtimeDataFactory;
		this._observation = null;
		this._observatories = null;
		this._observationMetaView = null;
		this._readingGroupView = null;
		this._user = User;

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

		// Add save/publish buttons based on roles
		if (this._observation.get('reviewed') === 'N') {
			this._createControls();
		} else {
			this._removeControls();
		}
		// calculate calibrations for summary view
		this.updateCalibrations();
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
		var getRealtimeData = this._getRealtimeData.bind(this);
		this._realtimeDataFactory.on('change:observatory', getRealtimeData);
		observation.eachMeasurement(function (measurement) {
			measurement.on('change:time', getRealtimeData);
		});

		// bind to measurement change
		var _updateErrorCount = this._updateErrorCount.bind(this);
		this._observation.eachMeasurement(function (measurement) {
			measurement.on('change', _updateErrorCount);
		});

		// bind calibration update to measurement change
		var updateCalibrations = this.updateCalibrations.bind(this);
		this._observation.eachMeasurement(function (measurement) {
			measurement.on('change', updateCalibrations);
		});
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
		    observatory,
		    i,
		    len;

		//filter observatories list for non admin users
		if (User.admin !== 'Y') {
			if (User.default_observatory_id !== null) {
				observatory_id = parseInt(User.default_observatory_id, 10);

				for (i = 0, len = observatories.length; i < len; i++) {
					if (observatories[i].id === observatory_id) {
						observatories = [observatories[i]];
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
			calculator: calculator,
			observatoryId: parseInt(window.location.hash.replace('#', ''), 10)
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
	 * Get realtime data for all measurements.
	 */
	ObservationView.prototype._getRealtimeData = function () {
		var realtimeDataFactory = this._realtimeDataFactory,
		    observatory = realtimeDataFactory.get('observatory'),
		    observation = this._observation,
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
	 * Create a panel at the bottom of the Observation view to create, update,
	 * or delete the observation.
	 *
	 */
	ObservationView.prototype._createControls = function () {
		var controls = this._el.querySelector('.observation-view-controls'),
		    saveButton = document.createElement('button'),
		    publishButton;

		saveButton.id = 'saveButton';
		saveButton.innerHTML = 'Save Observation';

		this._onSaveClick = this._onSaveClick.bind(this);
		saveButton.addEventListener('click', this._onSaveClick);

		controls.appendChild(saveButton);

		// Add publish button for admin users
		if (this._user && this._user.admin === 'Y') {
			publishButton = document.createElement('button');
			publishButton.innerHTML = 'Publish';
			controls.appendChild(publishButton);

			this._onPublishClick = this._onPublishClick.bind(this);
			publishButton.addEventListener('click', this._onPublishClick);
		}
	};

	/**
	 * Removes the save and publish buttons after an observation
	 * is successfully published.
	 */
	ObservationView.prototype._removeControls = function () {
		var controls = this._el.querySelector('.observation-view-controls');

		controls.innerHTML =
				'<div class="alert success">Observation has been published.</div>';
	};

	/**
	 * Save button click handler.
	 */
	ObservationView.prototype._onSaveClick = function () {
		this._saveObservation(this.__saveSuccess, this.__saveError);
	};

	/**
	 * Save the current observation.
	 *
	 * @param callback {Function}
	 *        called after save succeeds.
	 * @param errback {Function}
	 *        called after save fails.
	 */
	ObservationView.prototype._saveObservation = function (callback, errback) {
		var _this = this,
		    factory = this._options.factory;

		// update observation reading model with calibrations before saving
		this.updateCalibrations();

		factory.saveObservation({
			observation: this._observation,
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
	 * Publish button click handler.
	 */
	ObservationView.prototype._onPublishClick = function () {
		var _this = this;

		try {
			this._saveObservation(function () {
					_this._publishObservation(function () {
						(new ModalView(
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
	 * Save the observation, on success publish that data to the magproc2 server.
	 *
	 * @param callback {Function}
	 *        called after publish succeeds.
	 * @param errback {Function}
	 *        called after publish fails.
	 */
	ObservationView.prototype._publishObservation = function (callback, errback) {
		var _this = this,
		    factory = this._options.factory,
		    user = this._options.user || {};

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
	 * Callback to show publish success in modal dialog.
	 *
	 * @param status {Integer}
	 *        http error status code.
	 * @param xhr {XMLHttpRequest}
	 *        XHR object with error information.
	 */
	ObservationView.prototype.__saveSuccess = function () {
		(new ModalView(
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
	ObservationView.prototype.__saveError = function (status, xhr) {
		(new ModalView(
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
	ObservationView.prototype.__publishSuccess = function () {
		(new ModalView(
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
	ObservationView.prototype.__publishError = function (status, xhr) {
		(new ModalView(
			'<h3>Error</h3><p>' + xhr.response + '</p>',
			{
				title: 'Publish Failed',
				classes: ['modal-error'],
				closable: true
			}
		)).show();
	};

	/**
	 * Summarize component D,H,Z and store the calibrated values on
	 * the reading model object
	 */
	ObservationView.prototype.updateCalibrations = function () {
		var factory = this._options.factory,
		    readings = this._observation.get('readings').data(),
		    i, len, reading;

		for (i = 0, len = readings.length; i < len; i++) {
			reading = readings[i];

			factory.setCalibrationD(reading);
			factory.setCalibrationH(reading);
			factory.setCalibrationZ(reading);
		}
	};


	ObservationView.prototype._updateErrorCount = function () {
		var errors = [],
		    el = this._el.querySelector('.observation-view-controls'),
		    errorDiv,
		    measurementErrors,
		    saveButton = el.querySelector('#saveButton'),
		    readingErrors, setNumber, list, header,
		    _this = this;


		this._observation.eachReading(function (reading) {

			setNumber = reading.get('set_number');
			readingErrors = [];

			reading.eachMeasurement(function (measurement) {

				// get all errors for the measurement
				measurementErrors = _this._formatMeasurementErrors(measurement);

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



	ObservationView.prototype._formatMeasurementErrors = function (measurement) {
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

	// return constructor
	return ObservationView;
});
