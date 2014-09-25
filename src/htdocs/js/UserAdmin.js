/* global MOUNT_PATH */

require.config({
	baseUrl: MOUNT_PATH + '/js',
	paths: {
		'mvc': '/hazdev-webutils/src/mvc',
		'util': '/hazdev-webutils/src/util',
		'tablist': '/hazdev-tablist/src/tablist'
	}
});

require([
	'geomag/UserAdminView'
], function (
	UserAdminView
) {
	'use strict';

	new UserAdminView({
		el: document.querySelector('.user-admin-view-wrapper'),
		factory: new UserFactory({
			url: MOUNT_PATH + '/user_data.php'
		})
	});
});