/**
 * @fileOverview Extend the aura-core mediator
 */
/*jslint sloppy:true*/
/*global define*/
define(["../libs/aura-core/mediator", "backbone", "../collections/todos",
    "../models/todo"], 
    function (mediator, backbone, todos, todo) {

    mediator.backbone = backbone;
    mediator.models = {todo: todo};
    mediator.collections = {todos: todos};

    return mediator;
});