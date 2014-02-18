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

	var ObservatoryView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ObservatoryView.prototype = Object.create(View.prototype);

	ObservatoryView.prototype.render = function () {
		// TODO :: Render current model

	};

	ObservatoryView.prototype._initialize = function () {
		var _this = this,
		    el = this._el,
		    observatoryId = this._options.observatoryId,
		    factory = this._options.factory;

		el.innerHTML = [
				'<section class="observatories column one-of-two"></section>',
				'<section class="observations column one-of-two"></section>',
		].join('');

		// load observatories
		factory.getObservatories({
			success: function (observatories) {
				_this._buildObservatoryList(observatories);

				if (observatoryId === null) {
					observatoryId = 2; // Barrow (alphabetical order)
					_this._getObservatory(observatoryId);
					_this._updateSelected(observatoryId);
				}
			}
		});

	};


	ObservatoryView.prototype._buildObservatoryList = function (data) {

		var observatories = this._el.querySelector('.observatories'),
		    observatoryList = document.createElement('ul'),
		    observatory, markup = [];

		observatories.innerHTML = '<h2>Observatories</h2>';

		for (var i = 0; i < data.length; i++) {
			observatory = data[i];
			markup.push('<li id=' + observatory.get('id') + '>' + observatory.get('name') + '</li>');
		}

		observatoryList.innerHTML = markup.join('');

		observatories.appendChild(observatoryList);

		var list = observatoryList.querySelectorAll('li');

		this._bindObservatoryListItems(list);

	};

	ObservatoryView.prototype._bindObservatoryListItems = function (observatories) {
		var _this = this,
		    observatory;

		for (var i = 0; i < observatories.length; i++) {
			observatory = observatories[i];
			// TODO: add onClick handler for list
			Util.addEvent(observatories[i], 'click', function () {
				_this._getObservatory(this.id);
				_this._updateSelected(this.id);
			});
		}

	};

	ObservatoryView.prototype._updateSelected = function (id) {

		// clear last selected observatory
		var selected = document.querySelector('.selected');

		if (selected) {
			selected.className = '';
		}
		// highlight currently selected observatory
		document.getElementById(id).className = 'selected';

	};

	ObservatoryView.prototype._getObservatory = function (id) {
		var _this = this,
		    factory = this._options.factory;

		factory.getObservatory({
			id: id,
			success: function (data) {
				_this._buildObservationList(data);
			}
		});

	};

	ObservatoryView.prototype._buildObservationList = function (observatory) {
		var observationsView = this._el.querySelector('.observations'),
		    observations = observatory.get('observations').data(),
		    observation, list, markup = [];

		observationsView.innerHTML = [
				'<h2>Observations</h2>',
				// '<h3>', observatory.get('name'),'</h3>',
				// '<small>',
				// 	observatory.get('latitude') ,', ', observatory.get('longitude') ,
				// '</small>',
				'<ul></ul>'
			].join('');

		list = observationsView.querySelector('ul');

		for (var i = 0; i < observations.length; i++) {
			observation = observations[i];
			markup.push('<li><a href="/observation/' + observation.get('id') + '">Observation ' + this._formatDate(observation) + '</a></li>');
		}

		list.innerHTML = markup.join('');
	};


	ObservatoryView.prototype._formatDate = function (observation) {
			var begin = new Date(observation.get('begin') || new Date().getTime()),
	    y = begin.getUTCFullYear(),
	    m = begin.getUTCMonth() + 1,
	    d = begin.getUTCDate();

		return y + '-' + (m<10?'0':'') + m + '-' + (d<10?'0':'') + d;
	};

	return ObservatoryView;
});
