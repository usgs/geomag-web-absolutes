require.config({
	baseUrl: 'js',
	paths: {
		'mvc': '/hazdev-webutils/src/mvc',
		'util': '/hazdev-webutils/src/util',
		'tablist': '/hazdev-tablist/src/tablist'
	}
});

require([
	'geomag/ObservationView'
], function (
	ObservationView
) {
	'use strict';

	new ObservationView({
		el: document.querySelector('.observation-view-wrapper')
	});
});
