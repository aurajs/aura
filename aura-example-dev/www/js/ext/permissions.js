/**
 * @fileOverview Extend the aura-core permissions
 */
define(["aura_perms"], function (permissions) {
    
    permissions.rules.todos = {bootstrap:true};
    
    return permissions;
});