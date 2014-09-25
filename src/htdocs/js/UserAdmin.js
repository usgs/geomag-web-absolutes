/* global userId, MOUNT_PATH */

require.config({
	baseUrl: MOUNT_PATH + '/js',
	paths: {
		'mvc': '/hazdev-webutils/src/mvc',
		'util': '/hazdev-webutils/src/util',
		'tablist': '/hazdev-tablist/src/tablist'
	}
});

require([
	'geomag/UserAdmin'
], function (
	UserAdmin
) {
	'use strict';

	new UserAdmin({
		el: document.querySelector('.user-admin-view-wrapper'),
		UserAdmin: UserAdmin
	});
});