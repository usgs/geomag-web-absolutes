require.config({
	baseUrl: 'js',
	paths: {
		'mvc': '/hazdev-webutils/src/mvc',
		'util': '/hazdev-webutils/src/util'
	},
	shim: {
	}
});

require([
	'geomag/ObservatoryView'
], function (ObservatoryView) {
	'use strict';
	new ObservatoryView({el: document.querySelector('.observatory-view')});
});
