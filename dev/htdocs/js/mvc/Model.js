/*global define*/

define([
	'mvc/Util',
	'mvc/Events'
], function(
	Util,
	Events
) {
	'use strict';

	/**
	 * Constructor.
	 * @param  data {Object} key/value attributes of this model.
	 */
	var Model = function(data) {
		this._model = Util.extend({}, data);
		// model is source of events
		Events.call(this);
	};

	// model is a source of events
	Model.prototype = Object.create(Events.prototype);

	/**
	 * API Method
	 *
	 * Extends the current settings with values found in the given settings.
	 * The _current settings are then serialized to a string and placed into
	 * localStorage.
	 *
	 * @param settings {Object}
	 *      The settings with which to extend the _current settings.
	 */
	Model.prototype.set = function(data, options) {
		// detect changes
		var changed = {},
			anyChanged = false,
			c;

		for (c in data) {
			if (!this._model.hasOwnProperty(c) || this._model[c] !== data[c]) {
				changed[c] = data[c];
				anyChanged = true;
			}
		}

		// persist changes
		this._model = Util.extend(this._model, data);

		if (options && options.hasOwnProperty('silent') && options.silent) {
			// don't trigger any events
			return;
		}

		// trigger events based on changes
		if (anyChanged ||
				(options && options.hasOwnProperty('force') && options.force)) {
			for (c in changed) {
				// events specific to a property
				this.trigger('change:' + c, changed[c]);
			}
			// generic event for any change
			this.trigger('change', changed);
		}
	};

	/**
	 * API Method
	 *
	 * Fetches the value for the _current setting associated with the specified
	 * key. If no key is given, return a copy of all _current settings.
	 *
	 * @param key {String|NULL}
	 *      The key for which to fetch the _current setting value.
	 */
	Model.prototype.get = function(key) {
		if (typeof(key) === 'undefined') {
			return this._model;
		}
		if (this._model.hasOwnProperty(key)) {
			return this._model[key];
		}
		return null;
	};


	return Model;
});
