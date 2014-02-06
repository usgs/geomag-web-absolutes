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


	var ObservationSummaryView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ObservationSummaryView.prototype = Object.create(View.prototype);


	ObservationSummaryView.prototype.render = function () {
		// TODO :: Render current model
	};

	ObservationSummaryView.prototype._initialize = function () {
		this._el.innerHTML = '<p>I am an ObservationSummaryView!</p>';
	};


	return ObservationSummaryView;
});
