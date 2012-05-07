/**
 * @fileOverview Extend the aura-core facade
 */
/*global define*/
define(["aura_sandbox", "core", "perms"],
    function (sandbox, core, perms) {

        var facade = Object.create(sandbox);

        facade.data.Store = core.data.Store;
        facade.mvc = core.mvc;

        return facade;
});
