/**
 * Extends the core mediator
 */
/*global define*/
define(["./core/mediator"], function (mediator) {
    mediator.events.queue = function () {
    	console.log("Mediator overridden: queue called.");
    };
    return mediator;
});