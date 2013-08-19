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
	 *
	 * A view displays data from models and collections.
	 *
	 * The constructor creates an "el" property on this object,
	 * using either options.el or creating a div element, and then calls
	 * initialize with the same arguments as the constructor.
	 *
	 * @param options {Object} view options.
	 * @param options.el {DOM Element} optional, when omitted a new div element
	 *                   is created during contruction.
	 */
	var View = function(options) {
		// view is source of events
		Events.call(this);

		// make sure view has an element
		this.el = (options && options.hasOwnProperty('el')) ?
				options.el : document.createElement('div');

		// let subclass initialize
		this.initialize.apply(this, arguments);
	};

	// view is a source of events
	View.prototype = Object.create(Events.prototype);


	/**
	 * After a view element is created, before returning from constructor.
	 *
	 * @param options {Object} view options.
	 * @param {...} any additional arguments passed to View constructor.
	 */
	View.prototype.initialize = function(options) {
	};

	/**
	 * View should make sure its display is up to date.
	 */
	View.prototype.render = function() {
	};


	// return constructor from closure
	return View;
});
