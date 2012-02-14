/**
 * @fileOverview Extend the aura-core facade
 */
/*global define*/
define(["../libs/aura-core/facade", "./mediator", "./permissions"], 
    function (facade, mediator, permissions) {
    
    facade.backbone = mediator.backbone;
    facade.models = mediator.models;
    facade.collections = mediator.collections;
    
    return facade;
});