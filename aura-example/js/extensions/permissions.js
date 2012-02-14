/**
 * @fileOverview Extend the aura-core permissions
 */
define(["../libs/aura-core/permissions"], function (permissions) {
    permissions.rules.appInit = {bootstrap:true};
    return permissions;
});