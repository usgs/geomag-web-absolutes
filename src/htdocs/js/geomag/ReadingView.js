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


	var ReadingView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ReadingView.prototype = Object.create(View.prototype);


	ReadingView.prototype.render = function () {
		// TODO :: Render current model
	};

	ReadingView.prototype._initialize = function () {
		this._el.innerHTML = '<p>I am an ReadingView!</p>';
	};


	return ReadingView;
});

