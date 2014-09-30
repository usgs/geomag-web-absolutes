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
	'mvc/Collection',

	'geomag/UserAdminView',
	'geomag/UserFactory',
	'geomag/ObservatoryFactory'
], function (
	Collection,

	UserAdminView,
	UserFactory,
	ObservatoryFactory
) {
	'use strict';

	new ObservatoryFactory().getObservatories({
		success: function (observatories) {
			new UserAdminView({
				el: document.querySelector('.user-admin-view-wrapper'),
				factory: new UserFactory({
					url: MOUNT_PATH + '/user_data.php'
				}),
				observatories: new Collection(observatories)
			});
		}
	});
});
