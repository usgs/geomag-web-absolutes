/* global observatoryId */
'use strict';

var BaselinePlot = require('geomag/BaselinePlot'),
    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    Events = require('util/Events'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    User = require('geomag/User');


var currentUser = User.getCurrentUser(),
    factory = ObservatoryFactory(),
    observatories = Collection([]);

observatories.on('select', function () {
  window.location.hash = observatories.getSelected().id;
});

factory.getObservatories({
  success: function (data) {
    var defaultId,
        triggerHashChange;

    triggerHashChange = false;
    observatories.reset(data);

    if (observatoryId !== null) {
      defaultId = observatoryId;
    } else if (window.location.hash) {
      defaultId = parseInt(window.location.hash.substring(1), 10);
      triggerHashChange = true;
    } else if (currentUser && currentUser.get('default_observatory_id')) {
      defaultId = currentUser.get('default_observatory_id');
    } else {
      defaultId = data[0].id;
    }

    observatories.selectById(defaultId);

    if (triggerHashChange) {
      Events.trigger('hashchange');
    }
  },
  error: function () {
    console.log('Failed to get observatories...');
  }
});

CollectionSelectBox({
  el: document.querySelector('.observatory-select-box'),
  collection: observatories,
  format: function (obs) {
    return obs.get('name');
  }
});

BaselinePlot({
  el: document.querySelector('.observation-baseline-plot-view')
});
