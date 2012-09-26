if (typeof Object.create !== 'function') {
  Object.create = function(o) {
    function F() {}
    F.prototype = o;

    return new F();
  };
}

// Starts main modules
// Publishing from core because that's the way that Nicholas did it...
define(['core'], function(core) {
  'use strict';

  core.start([{
    channel: 'todos',
    options: {
      element: '#todoapp'
    }
  }, {
    channel: 'calendar',
    options: {
      element: '#calendarapp'
    }
  }, {
    channel: 'controls',
    options: {
      element: '#controlsapp'
    }
  }, {
    channel: 'boilerplate',
    options: {
      element: '#boilerplateapp'
    }
  }, {
    channel: 'router',
    options: {
      element: '#router'
    }
  }]);
});
