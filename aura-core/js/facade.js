/**
 * Extends the core facade
 */
/*global define*/
define(["./core/mediator", "./core/facade", "./permissions"], function (mediator, facade, permissions) {
    facade.events.queue = mediator.events.queue;
    return facade;
});