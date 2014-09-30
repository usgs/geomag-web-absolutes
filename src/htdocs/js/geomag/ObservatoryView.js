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
		if (typeof id === 'undefined' || id === null) {
			id = this._options.observatoryId;
		}

		if (this._observatorySelect && id) {
			this._observatorySelect.value = 'observatory_' + id;
		}

		this._getObservations(id);
	};

	ObservatoryView.prototype._initialize = function () {
		var _this = this,
		    el = this._el,
		    id = this._options.observatoryId,
		    hash;

		hash = this._getHash();

		// Overview of a single observatory
		if (id) {
			el.innerHTML = [
				'<h2 class="observatory-title">Observatory #', id, '</h2>',
				'<section class="observations-view"></section>',
			].join('');

			this._observatoryTitle = el.querySelector('.observatory-title');
			this._getObservatories(); // Just to update the title
			this._getObservations(id);

		// Overview of all observatories/ observations
		} else {
			el.innerHTML = [
				'<label for="observatories-select">Select Observatory</label>',
				'<select name="observatories" class="observatories" ',
						'id="observatories-select"></select>',
				'<section class="observations-view"></section>'
			].join('');

			this._observatorySelect = el.querySelector('.observatories');
			this._observatorySelect.addEventListener('change', function () {
				var value = this.value.replace('observatory_', '');
				window.location.hash = '#' + value;
			});

			// Gets observatories and then renders observations for either...
			// ... (1) The observatory whose Id is in the current window.location.hash
			// ... or ...
			// ... (2) The first observatory in the list
			// This could all be done better with promises...just saying.
			this._getObservatories();

			// on a URL change, update the observatory
			Events.on('hashchange', function() {
				_this.render(_this._getHash());
			});
		}

	};

	ObservatoryView.prototype._getObservatories = function () {
		var _this = this,
		    factory = this._options.factory;

		// load observatories
		factory.getObservatories({
			success: function (observatories) {
				var hash = _this._getHash();

				if (_this._observatorySelect) {
					_this._buildObservatoryList(observatories);

					if (!hash) {
						if (window.location.replace) {
							window.location.replace('#' + observatories[0].get('id'));
						} else {
							window.location.hash = '#' + observatories[0].get('id');
						}
					} else {
						_this.render(hash);
					}
				} else {
					_this._setObservatoryTitle(observatories);
				}
			}
		});
	};

	ObservatoryView.prototype._setObservatoryTitle = function (data) {
		var i,
		    len = data.length,
		    observatory;

		for (i = 0; i < len; i++) {
			observatory = data[i];
			if (observatory.get('id') === this._options.observatoryId) {
				this._observatoryTitle.innerHTML = observatory.get('code');
				break;
			}
		}
	};

	ObservatoryView.prototype._buildObservatoryList = function (data) {

		var observatoryList = this._observatorySelect,
		    markup = [], observatory, observatoryId;

		for (var i = 0; i < data.length; i++) {
			observatory = data[i];
			observatoryId = 'observatory_' + observatory.get('id');

			markup.push([
				'<option value="', observatoryId, '" id="', observatoryId, '">',
					observatory.get('name') ,
				'</option>'
			].join(''));
		}

		observatoryList.innerHTML = markup.join('');
	};

	ObservatoryView.prototype._getObservations = function (id) {
		var _this = this,
		    el = this._el;

		this._observationsView = null;

		if (typeof id !== 'undefined' && id !== null) {
			_this._observationsView = new ObservationsView({
					el: el.querySelector('.observations-view'),
					observatoryId: id
			});
		}
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
