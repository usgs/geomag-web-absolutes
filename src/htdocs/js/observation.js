/* global observationId, MOUNT_PATH */

require.config({
	baseUrl: MOUNT_PATH + '/js',
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
		el: document.querySelector('.observation-view-wrapper'),
		observationId: observationId
	});

});
