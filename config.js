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
        jquery: '../../aura/lib/jquery/jquery',

        // Zepto
        zepto: '../../aura/lib/zepto/zepto',
        deferred: '../../aura/lib/zepto/deferred',

        dom: '../../aura/lib/dom',

        core: '../../backbone-aura/mediator',
        perms: '../../backbone-aura/permissions',
        sandbox: '../../backbone-aura/facade',

        aura_core: '../../aura/mediator',
        aura_perms: '../../aura/permissions',
        aura_sandbox: '../../aura/facade',

        text: '../../backbone-aura/lib/text',
        backbone: '../../backbone-aura/lib/backbone',
        localstorage: '../../backbone-aura/lib/localstorage',
        underscore: '../../aura/lib/underscore',
        fullcalendar: '../../backbone-aura/lib/fullcalendar.min',
        jquery_ui: '../../backbone-aura/lib/jquery-ui.min'
    }
})
