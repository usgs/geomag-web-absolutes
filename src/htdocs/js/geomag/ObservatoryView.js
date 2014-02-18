/* global define */
define([
	'mvc/View',
	'util/Util',
	'geomag/ObservatoryFactory',
	'geomag/ObservationsView'
], function (
	View,
	Util,
	ObservatoryFactory,
	ObservationsView
) {
	'use strict';


	var DEFAULTS = {
		observatoryId: 2,
		factory: new ObservatoryFactory()
	};


	var ObservatoryView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};

	ObservatoryView.prototype = Object.create(View.prototype);


	ObservatoryView.prototype.render = function (id) {
		this._getObservations(id);
		this._updateSelected(id);
	};


	ObservatoryView.prototype._initialize = function () {
		var el = this._el;

		el.innerHTML = [
				'<section class="observatories column one-of-two"></section>',
				'<section class="observations-view column one-of-two"></section>',
		].join('');

		this._getObservatories();
		this.render(this._options.observatoryId);
	};


	ObservatoryView.prototype._getObservatories = function () {

		var _this = this,
		    factory = this._options.factory;

		_this.observatoryId = this._options.observatoryId;

		// load observatories
		factory.getObservatories({
			success: function (observatories) {
				_this._buildObservatoryList(observatories);
				_this._updateSelected(_this.observatoryId);
			}
		});
	};


	ObservatoryView.prototype._buildObservatoryList = function (data) {

		var el = this._el.querySelector('.observatories'),
		    observatoryList = document.createElement('ul'),
		    observatory, listItem;

		for (var i = 0; i < data.length; i++) {
			observatory = data[i];

			listItem = document.createElement('li');
			listItem.id = observatory.get('id');
			listItem.innerHTML = observatory.get('name');

			observatoryList.appendChild(listItem);

			this._bindObservatoryListItems(listItem);
		}

		el.innerHTML = '<h2>Observatories</h2>';
		el.appendChild(observatoryList);

	};


	ObservatoryView.prototype._bindObservatoryListItems = function (observatory) {
		var _this = this;

		Util.addEvent(observatory, 'click', function () {
			_this.render(this.id);
		});
	};


	ObservatoryView.prototype._updateSelected = function (id) {

		// clear last selected observatory
		var selected = document.querySelector('.selected'),
		    element = document.getElementById(id);

		if (selected) {
			selected.className = '';
		}
		// highlight currently selected observatory
		if (element) {
			element.className = 'selected';
		}
	};


	// list observations for observatory
	ObservatoryView.prototype._getObservations = function (id) {
		var _this = this,
		    el = this._el,
		    factory = this._options.factory;

		this._observationsView = null;

		factory.getObservatory({
			id: id,
			success: function (data) {
				_this._observationsView = new ObservationsView({
					el: el.querySelector('.observations-view'),
					observations: data.get('observations').data()
				});
			}
		});
	};


	return ObservatoryView;
});
