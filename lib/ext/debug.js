define('aura/ext/debug', function() {
  'use strict';

  return {
    name: 'debug',

    initialize: function(app) {
      if (typeof window.attachDebugger === 'function') {
          window.attachDebugger(app);
      }
    }
  };
});
