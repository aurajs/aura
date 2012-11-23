if (typeof Object.create !== 'function') {
  Object.create = function(o) {
    function F() {}
    F.prototype = o;

    return new F();
  };
}

// Starts main modules
// Publishing from core because that's the way that Nicholas did it...
define(['aura_core', 'perms', 'backboneSandbox'], function(core, permissions, backboneSandbox) {
  'use strict';

  core.getSandbox = function(sandbox) {
    return backboneSandbox.extend(sandbox);
  };

  core.start({
    'todos': {
      options: {
        element: '#todoapp'
      }
    },
    'calendar': {
      options: {
        element: '#calendarapp'
      }
    },
    'controls': {
      options: {
        element: '#controlsapp'
      }
    },
    'boilerplate': {
      options: {
        element: '#boilerplateapp'
      }
    },
    'router': {
      options: {
        element: '#router'
      }
    }
  });


});
