/*global require, requirejs*/
// Require.js allows us to configure shortcut alias
require.config({

    shim: {
        'underscore': {
            exports: '_'
        },

        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    },

    paths: {

        core: 'ext/mediator',
        perms: 'ext/permissions',
        sandbox: 'ext/facade',

        aura_core: '../aura/mediator',
        aura_perms: '../aura/permissions',
        aura_sandbox: '../aura/facade',

        text: 'ext/lib/text',
        backbone: 'ext/lib/backbone',
        localstorage: 'ext/lib/localstorage',
        jquery: '../aura/lib/jquery',
        underscore: '../aura/lib/underscore',
        jquery_ui: 'ext/lib/jquery-ui.min'

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
requirejs(['core'], function (core) {
    //core.publish(...)
});