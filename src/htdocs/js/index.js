/* global observatoryId */
'use strict';

var ObservatoryView = require('geomag/ObservatoryView'),
    User = require('geomag/User');

var id = observatoryId,
    user = User.getCurrentUser();

id = parseInt(user.get('default_observatory_id'), 10);

ObservatoryView({
  el: document.querySelector('.observatory-view'),
  observatoryId: id,
  user: user
});
