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


	var ObservationMetaView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ObservationMetaView.prototype = Object.create(View.prototype);


	ObservationMetaView.prototype.render = function () {
		// TODO :: Render current model
	};

	ObservationMetaView.prototype._initialize = function () {
		this._el.innerHTML = '<p>I am an ObservationMetaView!</p>';
	};


	return ObservationMetaView;
});
