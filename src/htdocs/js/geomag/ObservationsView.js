/* global define */
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
		var observations = this._options.observations;

		this._el.innerHTML = [
				'<h2>Observations</h2>',
				'<section class="observations-new"></section>',
				'<section class="observations-pending">></section>',
				'<section class="observations-completed">></section>'
		].join('');

		// You can pass in an id or a collection of observations
		if (observations) {
			this.render(observations);
		} else {
			this.getObservationsById(this._options.observatoryId);
		}
	};

	ObservationsView.prototype.render = function (observations) {

		// create, "add new observation" button
		this.getAddObservationButton();

		// build pending observations list
		this.getPendingObservations(observations);

		// build completed observations list
		this.getCompletedObservations(observations);

	};

	// get observations from observatoryId
	ObservationsView.prototype.getObservationsById = function (observatoryId) {

		var _this = this,
		    factory = this._options.factory;

		factory.getObservatory({
			id: observatoryId,
			success: function (data) {
				var observations = data.get('observations').data();
				_this.render(observations);
			}
		});
	};

	ObservationsView.prototype.getAddObservationButton = function () {
		var el = this._el.querySelector('.observations-new'),
		    button = document.createElement('a');

		// TODO, get create new button
		button.className = 'button';
		button.href = '/observation/';
		button.role = 'button';
		button.innerHTML = 'Add New Observation';

		el.appendChild(button);
	};

	ObservationsView.prototype.getPendingObservations = function (observations) {
		var el = this._el.querySelector('.observations-pending'),
		    pending = [],
		    observation;

		for (var i = 0; i < observations.length; i++) {
			observation = observations[i];

			// if (observation.reviewed === 'N') {
			// 	pending.push(observation);
			// }
			pending.push(observation); // DELETE, just for testing
		}

		el.innerHTML = '<h3>Pending</h3>';
		el.appendChild(this._buildObservationList(pending));
	};

	ObservationsView.prototype.getCompletedObservations = function (observations) {
		var el = this._el.querySelector('.observations-completed'),
		    completed = [],
		    observation;

		for (var i = 0; i < observations.length; i++) {
			observation = observations[i];

			// if (observation.reviewed === 'Y') {
			// 	completed.push(observation);
			// }
			//completed.push(observation); // DELETE, just for testing
		}

		el.innerHTML = '<h3>Completed</h3>';
		el.appendChild(this._buildObservationList(completed));
	};

	ObservationsView.prototype._buildObservationList = function (observations) {
		var list = document.createElement('ul'),
		    observation, markup = [];

		for (var i = 0; i < observations.length; i++) {
			observation = observations[i];
			markup.push('<li><a href="/observation/' + observation.get('id') + '">Observation ' + this._formatDate(observation) + '</a></li>');
		}

		if (observations.length === 0) {
			markup.push('<li class="empty">There are no observations.</li>');
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