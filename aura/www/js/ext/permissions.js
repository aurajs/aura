/**
 * @fileOverview Extend the aura-core permissions
 */
define(["aura_perms"], function (permissions) {
    
    permissions.extend({
        todos: {bootstrap:true},
        calendar: {bootstrap:true}
    });
    
    return permissions;
});