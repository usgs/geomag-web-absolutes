require.config({
	baseUrl: 'js',
	paths: {
	},
	shim: {
	}
});

require([
	'Greeter'
], function (Greeter) {
	'use strict';
	var g = new Greeter();
	console.log(g.sayHello());
});
