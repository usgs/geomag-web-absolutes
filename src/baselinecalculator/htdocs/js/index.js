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
  'geomag/ObservatoryView',
  'geomag/User'
], function (
  ObservatoryView,
  User
) {
  'use strict';

  var id = observatoryId,
      user = User.getCurrentUser();

  if (user.get('admin') !== 'Y') {
    id = parseInt(user.get('default_observatory_id'), 10);
  }

  new ObservatoryView({
    el: document.querySelector('.observatory-view'),
    observatoryId: id
  });
});
