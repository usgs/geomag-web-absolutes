/* global MOUNT_PATH */
'use strict';

var Collection = require('mvc/Collection'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    UserAdminView = require('geomag/UserAdminView'),
    UserFactory = require('geomag/UserFactory');


ObservatoryFactory().getObservatories({
  success: function (observatories) {
    UserAdminView({
      el: document.querySelector('.user-admin-view-wrapper'),
      factory: UserFactory({
        url: MOUNT_PATH + '/user_data.php'
      }),
      observatories: Collection(observatories)
    });
  }
});
