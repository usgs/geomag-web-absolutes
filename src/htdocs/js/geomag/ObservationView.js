/* global define */
define([
	'mvc/View',
	'util/Util'
], function (
	View,
	Util
) {
	'use strict';


	var DEFAULTS = {
	};


	var ObservationView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ObservationView.prototype = Object.create(View.prototype);


	ObservationView.prototype.render = function () {
		// TODO :: Render current model
	};

	ObservationView.prototype._initialize = function () {
		this._el.innerHTML = '<p>I am an ObservationView!</p>';
	};


	return ObservationView;
});
