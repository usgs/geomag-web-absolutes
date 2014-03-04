/* global observatoryId, MOUNT_PATH */

require.config({
	baseUrl: MOUNT_PATH + '/js',
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
	new ObservatoryView({
		el: document.querySelector('.observatory-view'),
		observatoryId: observatoryId
	});
});
