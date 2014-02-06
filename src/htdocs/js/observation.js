require.config({
	baseUrl: 'js',
	paths: {
		'mvc': '/hazdev-webutils/src/mvc',
		'util': '/hazdev-webutils/src/util'
	}
});

require([
	'geomag/ObservationView'
], function (
	ObservationView
) {
	'use strict';

	new ObservationView({
		el: document.querySelector('.observationView')
	});
});
