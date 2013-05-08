define('aura/ext/debug', function() {
  'use strict';

  return {
    name: 'debug',

    initialize: function(app) {
      if (typeof window.attachDebugger === 'function') {
        app.logger.log('Attaching debugger ...');
        window.attachDebugger(app);
      }
    }
  };
});
