define('aura/ext/debug', function() {
  'use strict';

  return {
    name: 'debug',

    require: {
      paths: {
        underscore: 'components/underscore/underscore'
      }
    },

    initialize: function(app) {
      var _ = require('underscore');
      if(_.isFunction(window.attachDebugger)){
          window.attachDebugger(app);
      }
    }
  };
});
