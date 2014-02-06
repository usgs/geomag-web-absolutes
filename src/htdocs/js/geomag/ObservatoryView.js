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


	var ObservatoryView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ObservatoryView.prototype = Object.create(View.prototype);


	ObservatoryView.prototype.render = function () {
		// TODO :: Render current model
	};

	ObservatoryView.prototype._initialize = function () {
		this._el.innerHTML = '<p>I am an ObservatoryView!</p>';
	};


	return ObservatoryView;
});
