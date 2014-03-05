/* global define, MOUNT_PATH */
define([
	'mvc/View',
	'util/Util',
	'geomag/ObservatoryFactory'
], function (
	View,
	Util,
	ObservatoryFactory
) {
	'use strict';

	var DEFAULTS = {
		observatoryId: null,
		factory: new ObservatoryFactory()
	};

	var ObservationsView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};

	ObservationsView.prototype = Object.create(View.prototype);

	ObservationsView.prototype._initialize = function () {

		this._el.innerHTML = [
				'<h2 class="title">Observations</h2>',
				'<section class="observations-new"></section>',
				'<section class="observations-all"></section>'
				// '<section class="observations-pending"></section>', // TODO
				// '<section class="observations-completed"></section>' // TODO
		].join('');

		// load all observations from an observatory
		this.getObservations(this._options.observatoryId);

	};

	ObservationsView.prototype.render = function (observatory) {

		// create, "add new observation" button
		this.getAddObservationButton();

		// first pass, get all observations, this can be removed once
		// observation status is implemented, see methods below
		this.getAllObservations(observatory);

		// TODO, build pending observations list
		//this.getPendingObservations(observations);

		// TODO, build completed observations list
		//this.getCompletedObservations(observations);

	};


	// get observations from observatoryId
	ObservationsView.prototype.getObservations = function (observatoryId) {

		var _this = this,
		    factory = this._options.factory;

		factory.getObservatory({
			id: observatoryId,
			success: function (observatory) {
				_this.render(observatory);
			},
			error: function () {
				_this._el.innerHTML = '<p>The observatory (id = ' + observatoryId +
						') that you requested does not exists in the database.</p>';
			}
		});
	};


	// create, "add new observation" button
	ObservationsView.prototype.getAddObservationButton = function () {
		var el = this._el.querySelector('.observations-new'),
		    button = document.createElement('a');

		button.className = 'button';
		button.href = MOUNT_PATH + '/observation/';
		button.role = 'button';
		button.innerHTML = 'Add New Observation';

		el.appendChild(button);
	};


	// get all observations
	ObservationsView.prototype.getAllObservations = function (observatory) {
		var el = this._el.querySelector('.observations-all'),
		    observations = observatory.get('observations').data(),
		    title = this._el.querySelector('.title');

		// set section title
		title.innerHTML = observatory.get('name');

		el.innerHTML = '<h3>Observations</h3>';
		el.appendChild(this._buildObservationList(observations));
	};


	// TODO, get all pending observations
	// ObservationsView.prototype.getPendingObservations =
	// 		function (observations) {
	// 	var el = this._el.querySelector('.observations-pending'),
	// 	    pending = [],
	// 	    observation;

	// 	for (var i = 0; i < observations.length; i++) {
	// 		observation = observations[i];

	// 		if (observation.reviewed === 'N') {
	// 			pending.push(observation);
	// 		}
	// 	}

	// 	el.innerHTML = '<h3>Pending</h3>';
	// 	el.appendChild(this._buildObservationList(pending));
	// };

	// TODO, get all completed observations
	// ObservationsView.prototype.getCompletedObservations =
	// 		function (observations) {
	// 	var el = this._el.querySelector('.observations-completed'),
	// 	    completed = [],
	// 	    observation;

	// 	for (var i = 0; i < observations.length; i++) {
	// 		observation = observations[i];

	// 		if (observation.reviewed === 'Y') {
	// 			completed.push(observation);
	// 		}
	// 	}

	// 	el.innerHTML = '<h3>Completed</h3>';
	// 	el.appendChild(this._buildObservationList(completed));
	// };


	ObservationsView.prototype._buildObservationList = function (observations) {
		var list = document.createElement('ul'),
		    observation, markup = [];

		if (observations === null || observations.length === 0) {
			list.innerHTML = '<li class="empty">There are no observations.</li>';
			return list;
		}

		for (var i = 0; i < observations.length; i++) {
			observation = observations[i];
			markup.push(
				'<li>' +
					'<a href="' + MOUNT_PATH + '/observation/' + observation.get('id') +
							'">Observation ' +
						this._formatDate(observation) +
					'</a>' +
					//TODO, add delete button to observations
					//'<a href="#" class="delete">Delete</a>' +
				'</li>'
			);
		}

		list.innerHTML = markup.join('');

		return list;
	};

	ObservationsView.prototype._formatDate = function (observation) {
			var begin = new Date(observation.get('begin') || new Date().getTime()),
	    y = begin.getUTCFullYear(),
	    m = begin.getUTCMonth() + 1,
	    d = begin.getUTCDate();

		return y + '-' + (m<10?'0':'') + m + '-' + (d<10?'0':'') + d;
	};

	return ObservationsView;

});
