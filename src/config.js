require.config({
    // shim underscore & backbone (cause we use the non AMD versions here)
    shim: {
        'dom': {
            exports: '$',
            deps: ['jquery'] // switch to the DOM-lib of your choice
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'dom'],
            exports: 'Backbone'
        },
        'deferred': {
            exports: 'Deferred',
            deps: ['dom']
        }
    },
    // paths
    paths: {
        // jQuery
        jquery: '../../../aura/lib/jquery/jquery',

        // Zepto
        zepto: '../../../aura/lib/zepto/zepto',
        deferred: '../../../aura/lib/zepto/deferred',

        dom: '../../../aura/lib/dom',

        core: '../../../extensions/backbone/mediator',
        perms: '../../../extensions/backbone/permissions',
        sandbox: '../../../extensions/backbone/facade',

        aura_core: '../../../aura/mediator',
        aura_perms: '../../../aura/permissions',
        aura_sandbox: '../../../aura/facade',

        text: '../../../extensions/backbone/lib/text',
        backbone: '../../../extensions/backbone/lib/backbone',
        localstorage: '../../../extensions/backbone/lib/localstorage',
        underscore: '../../../aura/lib/underscore',
        fullcalendar: '../../../extensions/backbone/lib/fullcalendar.min',
        jquery_ui: '../../../extensions/backbone/lib/jquery-ui.min'
    }
});