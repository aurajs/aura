define(['sandbox', './views/app', './collections/events', 'fullcalendar'], function(sandbox, AppView, Events) {
  'use strict';

  return function(options) {
    var events = new Events();

    new AppView({
      el: sandbox.dom.find(options.element),
      collection: events
    }).render();

    events.fetch();

    sandbox.emit('initialized', 'Initialized Calendar.');
    sandbox.on.log('calendar.**');
  };

});
