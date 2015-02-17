'use strict';

var Collection = require('mvc/Collection'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    UserAdminView = require('geomag/UserAdminView'),
    UserFactory = require('geomag/UserFactory');


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
