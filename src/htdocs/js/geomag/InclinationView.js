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


	var InclinationView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	InclinationView.prototype = Object.create(View.prototype);


	InclinationView.prototype.render = function () {
		// TODO :: Render current model
	};

	InclinationView.prototype._initialize = function () {
		this._el.innerHTML = '<p>I am an InclinationView!</p>';
	};


	return InclinationView;
});
