/**
 * @fileOverview Extend the aura-core facade
 */
/*global define*/
define(["../libs/aura-core/facade", "./mediator", "./permissions"], 
    function (facade, mediator, permissions) {

        facade.data.Store = mediator.data.Store;    
        facade.mvc = mediator.mvc;
    
        return facade;
});
