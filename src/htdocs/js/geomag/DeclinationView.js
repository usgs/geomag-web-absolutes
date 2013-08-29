/*global define*/
define([
	'mvc/Util',
	'mvc/View'
], function (
	Util,
	View
){
	'use strict';

	var DeclinationView = function (options) {
		// call parent constructor
		View.call(this, options);
	};

	// extend View class
	DeclinationView.prototype = Object.create(View.prototype);

	// return constructor
	return DeclinationView;
});
