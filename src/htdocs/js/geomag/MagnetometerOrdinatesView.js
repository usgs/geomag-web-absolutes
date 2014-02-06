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


	var MagnetometerOrdinatesView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	MagnetometerOrdinatesView.prototype = Object.create(View.prototype);


	MagnetometerOrdinatesView.prototype.render = function () {
		// TODO :: Render current model
	};

	MagnetometerOrdinatesView.prototype._initialize = function () {
		this._el.innerHTML = '<p>I am an MagnetometerOrdinatesView!</p>';
	};


	return MagnetometerOrdinatesView;
});
