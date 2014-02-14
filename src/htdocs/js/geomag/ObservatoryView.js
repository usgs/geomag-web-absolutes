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
		    factory = this._options.factory;

		el.innerHTML = [
				'<section class="observatories"></section>',
				'<section class="observations-view"></section>',
		].join('');


		// load observatories
		factory.getObservatories({
			success: function (observatories) {
				_this._buildObservatoryList(observatories);
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
		    factory = this._options.factory;

		for (var i = 0; i < observatories.length; i++) {
			// TODO: add onClick handler for list
			Util.addEvent(observatories[i], 'click', function () {
				factory.getObservatory({
					id: this.id,
					success: function (data) {
						_this._buildObservationList(data);
					}
				});
			});
		}

	};


	ObservatoryView.prototype._buildObservationList = function (observatory) {
		var observationsView = this._el.querySelector('.observations-view'),
		    observations = observatory.get('observations').data(),
		    observation, list, markup = [];

		observationsView.innerHTML = [
				'<h2>', observatory.get('name'),'</h2>',
				'<small>',
					observatory.get('latitude') ,', ', observatory.get('longitude') ,
				'</small>',
				'<ul class="observations"></ul>'
			].join('');

		list = observationsView.querySelector('.observations');

		for (var i = 0; i < observations.length; i++) {
			observation = observations[i];
			markup.push('<li><a href="/observation/' + observation.get('id') + '">Observation ' + observation.get('id') + '</a></li>');
		}

		list.innerHTML = markup.join('');
	};



	return ObservatoryView;
});
