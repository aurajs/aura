define(['sandbox', '../models/event'], function(sandbox, Event) {
  'use strict';

  var Events = sandbox.mvc.Collection({
    model: Event,

    // url: 'events',

    // Save all of the calendar items under the `'events'` namespace.
    localStorage: new sandbox.data.Store('events-backbone-require')
  });

  return Events;

});
