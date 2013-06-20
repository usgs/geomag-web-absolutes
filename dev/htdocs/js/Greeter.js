/* global define */
define([], function () {
	'use strict';

	var Greeter = function () {
	};
	Greeter.prototype = {
		sayHello: function () {
			return 'Hello world';
		},
		sayGoodbye: function () {
			return 'Goodbye';
		}
	};
	return Greeter;
});
