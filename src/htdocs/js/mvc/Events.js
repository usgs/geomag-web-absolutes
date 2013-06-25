/*global define*/

/**
 * A Lightweight event framework, inspired by backbone.
 */
define([], function() {
	'use strict';

	/**
	 * Constructor.
	 */
	var Events = function() {
		// map of listeners by event type
		this._listeners = {};
	};


	/**
	 * Add an event listener
	 *
	 * @param evt {String} event name (singular).  E.g. "reset"
	 * @param callback {Function} function to call when event is triggered.
	 * @param context {Object} context for "this" when callback is called.
	 */
	Events.prototype.on = function(evt, callback, context) {
		if (!this._listeners.hasOwnProperty(evt)) {
			// first listener for event type
			this._listeners[evt] = [];
		}

		// add listener
		this._listeners[evt][this._listeners[evt].length] = {
			'callback': callback,
			'context': context
		};
	};

	/**
	 * Remove an event listener
	 *
	 * Omitting context clears all listeners of same type and method.
	 * Omitting callback clears all listeners for given event.
	 * Omitting evt clears all listeners for all events.
	 *
	 * @param evt {String} event name to unbind.
	 * @param callback {Function} callback to unbind.
	 * @param context {Function} context used when binding.
	 */
	Events.prototype.off = function(evt, callback, context) {
		if (typeof evt === 'undefined') {
			// removing all listeners on this object
			this._listeners = null;
			this._listeners = {};
		} else if (typeof callback === 'undefined') {
			// removing all listeners for this event
			delete this._listeners[evt];
		} else {
			var listener = null;

			// search for callback to remove
			for (var i=this._listeners[evt].length-1; i>=0; i--) {
				listener = this._listeners[evt][i];
				if (listener.callback === callback &&
						(!context || listener.context === context)) {
					// found callback, remove
					this._listeners[evt].splice(i,1);
					if (context) {
						// found callback with context, stop searching
						break;
					}
				}
			}

			// cleanup if last callback of this type
			if (this._listeners[evt].length === 0) {
				delete this._listeners[evt];
			}
			listener = null;
		}
	};

	/**
	 * Trigger an event
	 *
	 * @param evt {String} event name.
	 * @param args {…} variable length arguments after event are passed to listeners.
	 */
	Events.prototype.trigger = function(evt) {
		if (this._listeners.hasOwnProperty(evt)) {
			var args = Array.prototype.slice.call(arguments, 1);

			for (var i=0, len=this._listeners[evt].length; i<len; i++) {
				var listener = this._listeners[evt][i];
				// NOTE: if listener throws exception, this will stop...
				listener.callback.apply(listener.context, args);
			}
		}
	};


	// return constructor from closure
	return Events;
});
