define(['sandbox', 'fullcalendar'], function(sandbox) {
  'use strict';

  var Event = sandbox.mvc.Model({
    // Default attributes for the todo if needed
    defaults: {
      start: $.fullCalendar.formatDate(new Date(), 'u'),
      end: false,
      title: 'New Event',
      color: '#33a1de'
    }
  });

  return Event;

});
