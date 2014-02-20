/* global define, unescape */
define([
	'mvc/View',
	'util/Events',
	'util/Util',
	'geomag/ObservatoryFactory',
	'geomag/ObservationsView'
], function (
	View,
	Events,
	Util,
	ObservatoryFactory,
	ObservationsView
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


	ObservatoryView.prototype.render = function (id) {
		if (id === null) {
			id = this._options.observatoryId;
		}

		this._getObservations(id);
		this._updateSelected(id);
	};


	ObservatoryView.prototype._initialize = function () {
		var _this = this,
		    el = this._el,
		    id = this._options.observatoryId,
		    hash;

		hash = this._getHash();

		// Overview of a single observatory, one column layout
		if (id) {
			el.innerHTML = [
					//'<section class="observatories"></section>',
					'<section class="observations-view"></section>',
			].join('');

			this._getObservations(id);

		// Overview of all observatories/ observations, two column layout
		} else {
			el.innerHTML = [
					'<section class="observatories column one-of-two"></section>',
					'<section class="observations-view column one-of-two"></section>',
			].join('');

			// TODO, find better way to render first observatory
			this._options.observatoryId = (hash) ? hash : 2; // render the first observatory
			this._getObservatories();
			this.render(this._options.observatoryId);
		}

		// on a URL change, update the observatory
		Events.on('hashchange', function() {
			_this.render(_this._getHash());
		});

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
		    markup = [], observatory;//, listItem, link;

		for (var i = 0; i < data.length; i++) {
			observatory = data[i];

			markup.push([
				'<li id="observatory_', observatory.get('id'),'">',
					'<a href="#', observatory.get('id') ,'" >',
						observatory.get('name') ,
					'</a>',
				'</li>'
			].join(''));
		}

		observatoryList.innerHTML = markup.join('');

		el.innerHTML = '<h2>Observatory</h2>';
		el.appendChild(observatoryList);

	};


	ObservatoryView.prototype._updateSelected = function (id) {

		// clear last selected observatory
		var selected = this._el.querySelector('.selected'),
		    element = this._el.querySelector('#observatory_' + id);

		if (selected) {
			selected.className = '';
		}
		// highlight currently selected observatory
		if (element) {
			element.className = 'selected';
		}
	};


	ObservatoryView.prototype._getObservations = function (id) {
		var _this = this,
		    el = this._el;

		this._observationsView = null;

		_this._observationsView = new ObservationsView({
				el: el.querySelector('.observations-view'),
				observatoryId: id
		});

	};


	ObservatoryView.prototype._getHash = function(url){

		var hash;

		if (typeof url === 'undefined' || url === null){
			url = window.location.hash;
		}

		if (url === '#' || url.indexOf('#') === -1) {
			return null;
		}

		// strip # from hash
		hash = url.substr(url.indexOf('#') + 1, url.length - url.indexOf('#'));
		// Fix URL encoding of settings hash
		hash = unescape(hash);

		return hash;
	};

	return ObservatoryView;
});
