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


	var ReadingGroupView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ReadingGroupView.prototype = Object.create(View.prototype);


	ReadingGroupView.prototype.render = function () {
		// TODO :: Render current model
	};

	ReadingGroupView.prototype._initialize = function () {
		this._el.innerHTML = '<p>I am an ReadingGroupView!</p>';
	};


	return ReadingGroupView;
});
