// Require.js allows us to configure shortcut alias
require.config({
    paths: {
        core: 'ext/mediator',
        perms: 'ext/permissions',
        sandbox: 'ext/facade',

        aura_core: 'aura/mediator',
        aura_perms: 'aura/permissions',
        aura_sandbox: 'aura/facade',

        backbone: 'ext/lib/backbone',
        localstorage: 'ext/lib/localstorage',
        jquery: 'aura/lib/jquery',
        underscore: 'aura/lib/underscore',
        fullcalendar: 'ext/lib/fullcalendar.min',
        bootstrap_modal: 'ext/lib/bootstrap-modal'
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
    core.publish('todos', "#todoapp");
    core.publish('calendar', "#calendarapp");
    // core.publish('todos', "#weatherapp");
});