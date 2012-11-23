define(['sandbox', './event', '../models/event', 'text!../templates/base.html'], function(sandbox, EventView, Event, baseTemplate) {
  'use strict';

  var AppView = sandbox.mvc.View({
    baseTemplate: sandbox.template.parse(baseTemplate),

    initialize: function() {
      this.$el.html(baseTemplate);
      this.calendar = this.$('.content');
      sandbox.events.bindAll(this);
      this.collection.bind('reset', this.addAll);
      this.collection.bind('event-added', this.addOne);
      this.collection.bind('event-modified', this.change);
      this.collection.bind('destroy', this.destroy);
      this.eventView = new EventView({
        el: this.$('#event-dialog-form')
      });
      this.eventView.collection = this.collection;

      // subscribe to routing events
      sandbox.on('route.calendar.**', this.calendarController, this);
    },

    calendarController: function() {
      var slice = Array.prototype.slice;
      var args = slice.call(arguments, 1); // strip off 'calendar'
      var action = args[0]; // such as 'changeView'
      if (action === 'gotoDate') {
        // ex: #calendar/gotoDate/2012/2/2
        if (args[3] != null) { // day entered
          this.calendar.fullCalendar('changeView', 'agendaDay');
        } else { // if not, month view
          this.calendar.fullCalendar('changeView', 'month');
        }
        var current = new Date(); // current date
        var year = args[1] || current.getYear(),
          month = args[2] - 1 || current.getMonth(), // months are 0-indexed
          day = args[3] || current.getDay();
        var date = new Date(year, month, day);

        this.calendar.fullCalendar.call(this.calendar, 'gotoDate', date);
      } else {
        // #calendar/changeView/agendaDay or
        // #calendar/changeView/month
        this.calendar.fullCalendar('changeView', args[1]);
      }

    },

    render: function() {
      this.calendar.fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,basicWeek,basicDay'
        },
        selectable: true,
        selectHelper: true,
        editable: true,
        ignoreTimezone: false,
        select: this.select,
        eventClick: this.eventClick,
        eventDrop: this.eventDropOrResize,
        eventResize: this.eventDropOrResize
      });
      window.calendar = this.calendar;
    },

    addAll: function() {
      this.calendar.fullCalendar('addEventSource', this.collection.toJSON());
    },

    addOne: function(event) {
      this.calendar.fullCalendar('renderEvent', event.toJSON());
      sandbox.emit('schedule', 'new-event', event.toJSON());
    },

    select: function(startDate, endDate) {
      this.eventView.model = new Event({
        start: startDate,
        end: endDate
      });
      this.eventView.render();
    },

    eventClick: function(fcEvent) {
      this.eventView.model = this.collection.get(fcEvent.id);
      this.eventView.render();
    },

    change: function(event) {
      // Look up the underlying event in the calendar and update its details from the model
      var fcEvent = this.calendar.fullCalendar('clientEvents', event.get('id'))[0];

      fcEvent.title = event.get('title');
      fcEvent.color = event.get('color');
      this.calendar.fullCalendar('updateEvent', fcEvent);
    },

    eventDropOrResize: function(fcEvent) {
      // Lookup the model that has the ID of the event and update its attributes
      this.collection.get(fcEvent.id).save({
        start: fcEvent.start,
        end: fcEvent.end
      });
    },

    destroy: function(event) {
      this.calendar.fullCalendar('removeEvents', event.id);
    }
  });

  return AppView;

});
