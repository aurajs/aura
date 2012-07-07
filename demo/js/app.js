/*global require, requirejs*/
// Require.js allows us to configure shortcut alias
require.config({
    shim: {
        'underscore': {
            exports: '_'
        },

        'backbone': {
            deps: ['underscore', 'dom'],
            exports: 'Backbone'
        },

        'deferred':{
            deps: ['dom']
        }
    },

    paths: {

        // jQuery
        dom: '../../aura/lib/jquery/jquery',

        // Zepto
        // dom: '../../aura/lib/zepto/zepto',
        // deferred: '../../aura/lib/zepto/deferred',

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
});




if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

// Starts main modules
// Publishing from core because that's the way that Nicholas did it...
requirejs(['core'], function (core) {
    core.start('todos', "#todoapp");
    core.start('calendar', "#calendarapp");
    core.start('controls', "#controlsapp");
});
