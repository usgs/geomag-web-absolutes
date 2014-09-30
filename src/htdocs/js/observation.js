/* global observationId, MOUNT_PATH, REALTIME_DATA_URL */

require.config({
	baseUrl: MOUNT_PATH + '/js',
	paths: {
		'mvc': '/hazdev-webutils/src/mvc',
		'util': '/hazdev-webutils/src/util',
		'tablist': '/hazdev-tablist/src/tablist'
	}
});

require([
	'geomag/ObservationView',
	'geomag/RealtimeDataFactory'
], function (
	ObservationView,
	RealtimeDataFactory
) {
	'use strict';

	new ObservationView({
		el: document.querySelector('.observation-view-wrapper'),
		observationId: observationId,
		realtimeDataFactory: new RealtimeDataFactory({
			url: REALTIME_DATA_URL
		})
	});

});
