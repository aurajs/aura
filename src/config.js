// Define call just to make enforceDefine check happy
define(function() {

  'use strict';

  // Aura configuration object is separate from require.config so we can have
  // access to it in src/aura/base.js
  require.aura = {

    // [RequireJS](http://requirejs.org/) 2.0+ plus has error callbacks (errbacks)
    // which provide per-require error handling. To utilize this feature
    // enforceDefine must be enabled and non-AMD dependencies must be shimmed.
    enforceDefine: true,

    // Set language stored in session cookie
    locale: window.document.cookie.split(/<\/?lang>/)[1],

    baseUrl: 'apps/demo/js',

    // Uncomment if you would like to support cache busting
    // urlArgs: "bust=v2",

    deps: ['app'],

    // shim underscore(lodash) & backbone (cause we use the non AMD versions here)
    shim: {
      'dom': {
        exports: '$',
        // switch to the DOM-lib of your choice
        // Could be either 'jquery' or 'zepto';
        deps: [ 'jquery' ]
      },
      'underscore': {
        exports: '_'
      },
      'backbone': {
        deps: ['underscore', 'dom'],
        exports: 'Backbone'
      },
      'zepto': {
        exports: 'Zepto'
      },
      'deferred': {
        exports: 'Deferred',
        deps: ['dom']
      },
      'fullcalendar': {
        deps: ['jquery'],
        exports: '$.fullCalendar'
      },
      'jquery_ui': {
        deps: ['jquery'],
        exports: '$.ui'
      }
    },

    // paths
    paths: {
      // jQuery
      jquery: '../../../aura/lib/jquery/jquery',

      // Zepto
      zepto: '../../../aura/lib/zepto/zepto',
      deferred: '../../../aura/lib/zepto/deferred',

      // Underscore (Lo-Dash - http://lodash.com)
      underscore: '../../../aura/lib/lodash',

      // Set the base library
      dom: '../../../aura/lib/dom',

      // Aura
      aura_base: '../../../aura/base',
      aura_core: '../../../aura/core',
      aura_perms: '../../../aura/permissions',
      aura_sandbox: '../../../aura/sandbox',

      // Widgets
      widgets: "../../../widgets",

      // Backbone Extension
      backboneSandbox: '../../../extensions/backbone/sandbox',
      text: '../../../extensions/backbone/lib/text',
      backbone: '../../../extensions/backbone/lib/backbone',
      i18n: '../../../i18n',
      localstorage: '../../../extensions/backbone/lib/localstorage',
      fullcalendar: '../../../extensions/backbone/lib/fullcalendar.min',
      jquery_ui: '../../../extensions/backbone/lib/jquery-ui.min',

      // Demo App
      perms: '../../../apps/demo/js/permissions'
    }

  };

  require.config( require.aura );

});
